import React, { Component } from 'react';
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
// import { CardSection } from './common';

class TranscriptionIndexItem extends Component {
  onRowPress() {
    Actions.TranscriptionShow({ transcription: this.props.currentTranscription });
  }

  render() {
    const { title } = this.props.transcription;
    console.log(this.props);

    return (
      <TouchableWithoutFeedback onPress={this.onRowPress.bind(this)}>
        <View>
          <Text style={styles.titleStyle}>
            { title }
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = {
  titleStyle: {
    fontSize: 18,
    paddingLeft: 15
  }
};

export default TranscriptionIndexItem;
