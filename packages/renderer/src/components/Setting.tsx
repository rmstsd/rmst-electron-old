import { Button, Divider, Input, Message, Space } from '@arco-design/web-react'
import { useEffect, useState } from 'react'

import { rmstIpcRenderer } from '#preload'

const Setting = () => {
  const [editorPath, setEditorPath] = useState<string>(undefined)
  const [dirPaths, setDirPaths] = useState<string[]>([])

  const saveSet = () => {
    rmstIpcRenderer.send('set-editorPath', editorPath)
    rmstIpcRenderer.send('set-dirPaths', dirPaths)

    Message.success('保存成功')
  }

  useEffect(() => {
    rmstIpcRenderer.invoke('get-editorPath').then(data => {
      if (data) setEditorPath(data)
    })
    rmstIpcRenderer.invoke('get-dirPaths').then(data => {
      if (data) setDirPaths(data)
    })
  }, [])

  const clearEleStore = () => {
    rmstIpcRenderer.send('clear-ele-store')

    setEditorPath(undefined)
    setDirPaths([])
    Message.info('已清除')
  }

  return (
    <div className="user-set" style={{ padding: 10 }}>
      <h3>使用的编辑器的 .exe文件路径</h3>
      <Input
        placeholder="例如: D:\Microsoft VS Code\Code.exe"
        value={editorPath}
        style={{ width: 400 }}
        onChange={setEditorPath}
      />

      <h3>项目所在的目录</h3>
      {dirPaths.map((item, index) => (
        <Space key={index} style={{ display: 'flex', marginBottom: 10 }}>
          <Input
            placeholder="路径 从我的电脑-地址栏复制"
            type="text"
            value={item}
            style={{ width: 400 }}
            onChange={value => {
              dirPaths[index] = value
              setDirPaths([...dirPaths])
            }}
          />
          <Button
            onClick={() => {
              dirPaths.splice(index, 1)
              setDirPaths([...dirPaths])
            }}
          >
            -
          </Button>
        </Space>
      ))}

      <Button onClick={() => setDirPaths(dirPaths.concat(''))} style={{ marginBottom: 5 }}>
        +
      </Button>

      <Button type="primary" onClick={saveSet} long>
        保存
      </Button>

      <Button type="primary" status="danger" onClick={clearEleStore} style={{ marginTop: 10 }}>
        清空本地缓存
      </Button>
    </div>
  )
}

export default Setting
