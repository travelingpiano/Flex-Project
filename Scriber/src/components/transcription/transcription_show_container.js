// import ArtworkDetail from './artwork_detail';
import {connect} from 'react-redux';
import {fetchTranscription}
  from '../../actions/transcription_actions';
import TranscriptionShow from './transcription_show';

// import {clearErrors} from '../../actions/error_actions';

const mapStateToProps = (state) => {
  return {
    transcriptions: state.transcriptions
    // currentTranscription: state.transcriptions.transcriptions[state.transcription.currentTranscription],
    // currentUser: state.session.currentUser,
    // errors: state.errors.errors
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchTranscription: id => dispatch(fetchTranscription(id)),
  // clearErrors: () => dispatch(clearErrors())
});

export default connect(mapStateToProps,mapDispatchToProps)(TranscriptionShow);