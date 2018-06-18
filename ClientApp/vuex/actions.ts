import axios from 'axios'

export const fetchInitialMessages = (action: { commit: (x: string, data: any) => void }, origin: any) => {
  // this one will run on server so it need FQDN or server won't able to resolve the API address
  return axios.get(`${origin}/initialMessages`).then(response => {
    action.commit('INITIAL_MESSAGES', response.data)
  }).catch(err => {
    console.log(err)
  })
}

export const fetchMessages = (action: { commit: (x: string, data: any) => void }, lastFetchedMessageDate: any) => {
  axios.post('/fetchMessages', {
    lastMessageDate: lastFetchedMessageDate
  })
    .then(response => {
      action.commit('FETCH_MESSAGES', response.data)
    }).catch(err => {
      console.log(err)
    })
}