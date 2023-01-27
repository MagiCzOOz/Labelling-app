import { ErrorMessage } from '../App'
import { LabelCountData } from '../components/dashboard/LabelCountTable'

export default async function fetchCurrentLabelsCount(issues: boolean): Promise<LabelCountData[] | ErrorMessage> {
  try {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    }
    let endpoint = 'countLabel'
    if (issues) {
      endpoint = 'countIssue'
    }
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/${endpoint}`, requestOptions)
    const currentLabelsCount = response.json()
    return currentLabelsCount
  } catch (err) {
    throw new Error(`${err}`)
  }
}
