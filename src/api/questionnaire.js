import http from '@/utils/https.js'

export function submitSurvey(params) {
    return http.post(`/survey/add`, params)
}