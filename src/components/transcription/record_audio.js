import React, {Component} from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

import Sound from 'react-native-sound';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
//uploading to AWS
import { RNS3 } from 'react-native-aws3';

// NOTE: Credits for the below code go to the example in Joshua Sierles'
// react-native-audio library (https://github.com/jsierles/react-native-audio)

class RecordAudio extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentTime: 0.0,
      recording: false,
      stoppedRecording: false,
      finished: false,
      audioPath: AudioUtils.DocumentDirectoryPath + '/test.aac',
      hasPermission: undefined,
      errors: ""
    };
  }

    prepareRecordingPath(audioPath){
      AudioRecorder.prepareRecordingAtPath(audioPath, {
        SampleRate: 22050,
        Channels: 1,
        AudioQuality: "Low",
        AudioEncoding: "aac",
        AudioEncodingBitRate: 32000
      });
    }

    componentDidMount() {
      this._checkPermission().then((hasPermission) => {
        this.setState({ hasPermission });

        if (!hasPermission) return;

        this.prepareRecordingPath(this.state.audioPath);

        AudioRecorder.onProgress = (data) => {
          this.setState({currentTime: Math.floor(data.currentTime)});
        };

        AudioRecorder.onFinished = (data) => {
          // Android callback comes in the form of a promise instead.
          if (Platform.OS === 'ios') {
            this._finishRecording(data.status === "OK", data.audioFileURL);
          }
        };
      });
    }

    _checkPermission() {
      if (Platform.OS !== 'android') {
        return Promise.resolve(true);
      }

      const rationale = {
        'title': 'Microphone Permission',
        'message': 'AudioExample needs access to your microphone so you can record audio.'
      };

      return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
        .then((result) => {
          console.log('Permission result:', result);
          return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
        });
    }

    _renderButton(title, onPress, active) {
      var style = (active) ? styles.activeButtonText : styles.buttonText;

      return (
        <TouchableHighlight style={styles.button} onPress={onPress}>
          <Text style={style}>
            {title}
          </Text>
        </TouchableHighlight>
      );
    }

    async _pause() {
      if (!this.state.recording) {
        console.warn('Can\'t pause, not recording!');
        return;
      }

      this.setState({stoppedRecording: true, recording: false});

      try {
        const filePath = await AudioRecorder.pauseRecording();

        // Pause is currently equivalent to stop on Android.
        if (Platform.OS === 'android') {
          this._finishRecording(true, filePath);
        }
      } catch (error) {
        // console.error(error);
      }
    }

    async _stop() {
      if (!this.state.recording) {
        console.warn('Can\'t stop, not recording!');
        return;
      }

      this.setState({stoppedRecording: true, recording: false});

      try {
        const filePath = await AudioRecorder.stopRecording();

        if (Platform.OS === 'android') {
          this._finishRecording(true, filePath);
        }
        return filePath;
      } catch (error) {
        console.error(error);
      }
    }

    async _play() {
      if (this.state.recording) {
        await this._stop();
      }

      // These timeouts are a hacky workaround for some issues with react-native-sound.
      // See https://github.com/zmxv/react-native-sound/issues/89.
      setTimeout(() => {
        var sound = new Sound(this.state.audioPath, '', (error) => {
          if (error) {
            console.log('failed to load the sound', error);
          }
        });

        setTimeout(() => {
          sound.play((success) => {
            if (success) {
              console.log('successfully finished playing');
            } else {
              console.log('playback failed due to audio decoding errors');
            }
          });
        }, 100);
      }, 100);
    }

    async _record() {
      if (this.state.recording) {
        console.warn('Already recording!');
        return;
      }

      if (!this.state.hasPermission) {
        console.warn('Can\'t record, no permission granted!');
        return;
      }

      if(this.state.stoppedRecording){
        this.prepareRecordingPath(this.state.audioPath);
      }

      this.setState({recording: true});

      try {
        const filePath = await AudioRecorder.startRecording();
      } catch (error) {
        console.error(error);
      }
    }

    _finishRecording(didSucceed, filePath) {
      this.setState({ finished: didSucceed });
      console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath}`);
      const file = {
        uri: filePath,
        name: `${this.props.transcriptionTitle}.aac`,
        type: 'audio/vnd.dlna.adts'
      }
      const options = {
        keyPrefix: "",
        bucket: "scriberflexproject",
        region: "us-west-2",
        accessKey: "AKIAJLDHHMYCV425E22Q",
        secretKey: "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",
        successActionStatus: 201
      }
      RNS3.put(file, options).then(response => {
        if (response.status !== 201)
          throw new Error("Failed to upload image to S3");
        console.log(response.body);
      });
    }

    _submit(){
      if(this.state.finished){
        Actions.TranscriptionForm({recorded: true, transcriptionTitle: this.props.transcriptionTitle, description: this.props.description, usernames: this.props.usernames});
      }else{
        this.setState({errors: "No file has been recorded!"})
      }
    }

    _renderButton(title, onPress, active) {
      let style = (active) ? styles.activeButtonTextStyle : styles.buttonTextStyle;

      return (
        <TouchableHighlight style={styles.buttonStyle} onPress={onPress}>
          <Text style={style}>
            {title}
          </Text>
        </TouchableHighlight>
      );
    }

    render() {
      const { containerStyle,
              controlsStyle,
              progressTextStyle } = styles;

      return (
        <View style={styles.containerStyle}>
          <View style={styles.controlsStyle}>
            {this._renderButton("RECORD", () => {this._record()}, this.state.recording )}
            {this._renderButton("PLAY", () => {this._play()} )}
            {this._renderButton("STOP", () => {this._stop()} )}
            {this._renderButton("PAUSE", () => {this._pause()} )}
            {this._renderButton("SUBMIT", ()=>{this._submit()})}
            <Text>{this.state.errors}</Text>
            <Text style={styles.progressTextStyle}>{this.state.currentTime}s</Text>
          </View>
        </View>
      );
    }
  }

  const styles = StyleSheet.create({
     containerStyle: {
       flex: 1,
     },
     controlsStyle: {
       flexDirection: 'column',
       justifyContent: 'center',
       alignItems: 'center',
       flex: 1,
     },
     progressTextStyle: {
       textAlign: 'center',
       paddingTop: 30,
       fontSize: 50,
       color: "#000",
     },

     buttonStyle: {
       width: 250,
       height: 40,
       margin: 10,
       backgroundColor: '#F26367',
       borderColor: '#F26367',
       borderRadius: 8,
       alignItems: 'center'
     },

     buttonTextStyle: {
       fontSize: 30,
       fontWeight: 'bold',
       color: "#FFF"
     },

     activeButtonTextStyle: {
       fontSize: 30,
       fontWeight: 'bold',
       color: "#000"
     }
   });

export default RecordAudio;
