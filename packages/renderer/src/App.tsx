import { Button, Divider, Popover, Space } from '@arco-design/web-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CircleSearch from './components/CircleSearch'
import DirSearch from './components/DirSearch'
import Setting from './components/Setting'
import Note from './components/Note'
import YoudaoTranslate from './components/YoudaoTranslate'

const map = {
  // CircleSearch,
  DirSearch,
  Setting
  // Note,
  // YoudaoTranslate
}

const keys = Object.keys(map)

function App() {
  const navigate = useNavigate()

  const query = Object.fromEntries(new URLSearchParams(window.location.search))

  const Component = map[query.ui]

  return (
    <div>
      <Popover
        style={{ padding: 0 }}
        position="bl"
        triggerProps={{ showArrow: false, popupAlign: { bottom: 0 } }}
        className="tool-bar-popover"
        content={
          <Space className="tool-bar">
            {keys.map(item => (
              <Button key={item} type="primary" onClick={() => navigate(`?ui=${item}`)}>
                {item}
              </Button>
            ))}
          </Space>
        }
      >
        <div style={{ height: 5, position: 'fixed', left: 0, right: 0, zIndex: 5 }}></div>
      </Popover>

      {Component ? <Component /> : '未匹配到组件'}
    </div>
  )
}

export default App
