import React from 'react';
import { StyleSheet,
         View,
         ListView,
         Button,
         Text,
         TextInput,
         TouchableHighlight } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

class TranscriptionEdit extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    // this.state = this.props.posts[this.props.match.params.postId];
  }

  // recordAudio() {
  //   insert record audio action
  //   return audio file
  // }

  addTranscription() {
    let data = new EditData();
    data.append('title', this.state.title);
    data.append('transcription', this.state.transcription);
    data.append('description', this.state.description);
    data.append('audio_url', this.state.audio_url);
    data.append('users', this.state.users);
    this.props.createTranscription(data)
      .then(Actions.TranscriptionShow());
  }

  render() {
    const { textInputStyle,
            attendeeTabStyle,
            formStyle,
            headerStyle,
            recordAudioStyle,
            transcriptionEditStyle } = styles;

    return (
      <View style={ transcriptionEditStyle } >
        <View style={ headerStyle }>
          <Text>
            Edit Transcription
          </Text>
        </View>

        <View style={ formStyle }>
          <TextInput
            style={ textInputStyle }
            label='Title'
            placeholder='Title'
            />
          <TextInput
            style={ textInputStyle }
            label='Description'
            placeholder='Description'
          />
        </View>

        <View style={ attendeeTabStyle }>
          <Text>
            Attendees
          </Text>
          <Button
            onPress={() => Actions.Attendees()}
            title='Add Attendees'
          />
      </View>

        <View style={ recordAudioStyle }>
          <Button
            onPress={() => Actions.RecordAudio({users: this.props.users})}
            title="Record Audio"
          />
        </View>

        <View>
          <Button
            onPress={() => this.addTranscription()}
            title="Create Transcription"
            />
        </View>
      </View>
    );
  }
}
// got to a new page with list of attendees to choose from to pick attendees

export default TranscriptionEdit;

const styles = StyleSheet.create({
  transcriptionEditStyle: {
    flex: 1,
  },

  attendeeTabStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  headerStyle: {
    flex: 1,
  },

  textInputStyle: {
    flex: 1,
  },

  formStyle: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#C6F1E4'
  },

  recordAudioStyle: {
    flex: 1
  },
});
