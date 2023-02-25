import React, { useEffect, useRef, useState } from 'react'
import { Input } from '@arco-design/web-react'
import path from 'path-browserify'

import { rmstIpcRenderer } from '#preload'
import classNames from 'classnames'

import { defaultList } from '../utils'

const dirSearch = () => {
  const [wd, setWd] = useState('')
  const [dirNamesTree, setDirNamesTree] = useState<any[]>([])
  const [selectIndex, setSelectIndex] = useState(0)

  const inputRef = useRef(null)

  useEffect(() => {
    rmstIpcRenderer.send('set-dir-win-size', document.body.offsetHeight)
  }, [wd])

  useEffect(() => {
    document.querySelector('.s-input').setAttribute('spellcheck', 'false')
    inputRef.current.dom.focus()

    document.onvisibilitychange = () => {
      if (document.visibilityState == 'visible') {
        inputRef.current.dom.focus()
      }
    }

    rmstIpcRenderer.invoke('project-names-tree').then(data => {
      setDirNamesTree(data)
    })

    return () => {
      document.onvisibilitychange = null
    }
  }, [])

  const onConfirm = index => {
    if (searchUrl) {
      rmstIpcRenderer.send('open-external', searchUrl)

      setWd('')
      return
    }

    const dir = flatDirNames[index]
    rmstIpcRenderer.send('spawn-open-dir', dir)

    setWd('')
    setSelectIndex(0)
  }

  const onKeyDown = (evt: React.KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown'].includes(evt.code)) {
      evt.preventDefault()

      if (evt.code === 'ArrowUp') {
        const nv = selectIndex - 1
        setSelectIndex(nv < 0 ? flatDirNames.length - 1 : nv)
      }
      if (evt.code === 'ArrowDown') {
        const nv = selectIndex + 1
        setSelectIndex(nv > flatDirNames.length - 1 ? 0 : nv)
      }
    }
  }

  const flatDirNames = search(dirNamesTree, wd)

  const { tipInfo, searchUrl } = (() => {
    const [shortcutWd] = wd?.split(' ') || []

    const matchItem = defaultList.find(item =>
      item.shortcutWd.map(o => o.toLowerCase()).includes(shortcutWd.toLowerCase())
    )

    if (matchItem && wd.at(shortcutWd.length) === ' ') {
      const searchWd = wd.slice(shortcutWd.length + 1)
      const searchUrl = matchItem.searchLink + searchWd

      return { tipInfo: `用${matchItem.title}搜索`, searchUrl }
    }

    return { tipInfo: '打开目录', searchUrl: undefined }
  })()

  return (
    <div>
      <section style={{ position: 'relative' }}>
        <Input
          ref={inputRef}
          placeholder="人美声甜"
          value={wd}
          onChange={value => {
            setSelectIndex(0)
            setWd(value)
          }}
          onPressEnter={() => onConfirm(selectIndex)}
          style={{ height: 60, borderRadius: 0, fontSize: 18, borderColor: 'transparent' }}
          className="s-input"
          onKeyDown={onKeyDown}
        />
        <div className="s-tipInfo win-drag">{tipInfo}</div>
      </section>

      {flatDirNames.length !== 0 && (
        <section className="search-list arco-select-popup" style={{ borderRadius: 0 }}>
          {flatDirNames.map((item, index) => (
            <div
              className={classNames('arco-select-option option-item', {
                'arco-select-option-hover': selectIndex === index
              })}
              key={index}
              onClick={() => onConfirm(index)}
            >
              {item}
            </div>
          ))}
        </section>
      )}
    </div>
  )
}

export default dirSearch

function search(dirNames, wd) {
  const seRes = wd.length
    ? dirNames
        .filter(item => item.children.some(o => o.toLowerCase().includes(wd.toLowerCase())))
        .map(item => ({
          ...item,
          children: item.children.filter(o => o.toLowerCase().includes(wd.toLowerCase()))
        }))
    : []
  const flatRes = seRes.reduce((acc, item) => acc.concat(item.children.map(o => path.join(item.name, o))), [])

  return flatRes
}
