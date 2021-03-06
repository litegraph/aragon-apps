const surveySettings = [
  ['token', 'tokenAddress'],
  ['minParticipationPct', 'minParticipationPct', 'number'],
  ['surveyTime', 'surveyTime', 'time'],
]

export function hasLoadedSurveySettings(state) {
  state = state || {}
  return surveySettings.reduce(
    (loaded, [_, key]) => loaded && !!state[key],
    true
  )
}

export default surveySettings
