export const fetchTranscriptions = () => (
  fetch('http://127.0.0.1:8000/transcriptions', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
);