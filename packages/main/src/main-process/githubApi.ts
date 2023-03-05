import { Octokit } from '@octokit/core'

const octokit = new Octokit({
  auth: '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'
})

const baseInfo = {
  owner: 'dream-unicorn',
  repo: 'rmst-json-preview',
  path: 'public/note.txt'
}

export function getContent() {
  return octokit
    .request('GET /repos/{owner}/{repo}/contents/{path}', {
      ...baseInfo,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    .then(res => {
      const { status, data } = res
      if (status === 200) {
        const { sha, content } = data as any
        return { sha, content: deBase64(content) }
      } else {
        return Promise.reject('getContent 失败')
      }
    })
}

export function updateContent(content: string, sha: string) {
  return octokit
    .request('PUT /repos/{owner}/{repo}/contents/{path}', {
      ...baseInfo,
      content: enBase64(content),
      sha,
      message: '修改笔记 -electron',
      committer: {
        name: '人美声甜-electron',
        email: 'rmst@qq.com'
      }
    })
    .then(res => {
      const { status } = res
      if (status !== 200) {
        return Promise.reject('更新失败')
      }
    })
}

function enBase64(str) {
  const buff = Buffer.from(str, 'utf-8')
  return buff.toString('base64')
}

function deBase64(str) {
  const buff = Buffer.from(str, 'base64')

  return buff.toString('utf-8')
}
