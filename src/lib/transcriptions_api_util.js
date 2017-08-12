export const createTranscription = data => (
  fetch('http://127.0.0.1:8000/transcriptions', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Origin': '',
      'Host': '127.0.0.1:8000',
    },
    body: data
  })
);

export const fetchTranscriptions = () => (
  fetch('http://127.0.0.1:8000/transcriptions', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
);

export const fetchTranscription = (id) => (
  fetch(`http://127.0.0.1:8000/transcriptions/${id}/`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
);

export const deleteTranscription = (transcription) => (
  fetch(`http://127.0.0.1:8000/transcriptions/${transcription.pk}/`,
    {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }));