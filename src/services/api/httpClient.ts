import axios from "axios"

const baseURL = "https://www.meucopoeco.com.br/eventos_mce/site/"

export const httpClient = axios.create({ baseURL })