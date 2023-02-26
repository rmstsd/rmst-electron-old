import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from '@arco-design/web-react'
import '@arco-design/web-react/dist/css/arco.css'

import App from './App'
import './index.less'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <ConfigProvider componentConfig={{ Button: { type: 'primary' } }}>
      <App />
    </ConfigProvider>
  </BrowserRouter>
)

document.addEventListener('input', evt => {
  const target = evt.target as HTMLElement

  if (target.tagName === 'INPUT') {
    target.setAttribute('spellcheck', 'false')
  }
})
