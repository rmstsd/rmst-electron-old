import { useEffect, useState } from 'react'
import classnames from 'classnames'
import { calcPaths, svgHeight, svgWidth } from '../utils'

import { rmstIpcRenderer } from '#preload'

const defaultList = []
type PickArrayItem<T> = T extends (infer R)[] ? R : never
type IItem = PickArrayItem<typeof defaultList>

const CircleSearch = () => {
  const [list] = useState(defaultList)
  const paths = calcPaths(list)

  const [ani, setAni] = useState(true)

  useEffect(() => {
    rmstIpcRenderer.on('exec-ani-circle', () => {
      setAni(true)
    })

    document.onvisibilitychange = () => {
      if (document.visibilityState == 'visible') {
        window.focus()
      }
    }
  }, [])

  const handleMenu = (item: IItem) => {
    rmstIpcRenderer.send('open-external', item.home)
    rmstIpcRenderer.send('hide-circle-search-win')
    setAni(false)
  }

  return (
    <div className={classnames('wrapper')}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        baseProfile="full"
        width={svgWidth}
        height={svgHeight}
        className={classnames('svg', { ani })}
        // style={{ border: '1px solid red' }}
      >
        <g>
          {paths.map(item => (
            <path
              fill="#fff"
              stroke="#eee"
              d={item.d}
              key={item.title}
              className="path"
              onMouseUp={() => handleMenu(item)}
            ></path>
          ))}

          {paths.map(item => (
            <text
              key={item.title}
              dominantBaseline="central"
              textAnchor="middle"
              transform={`translate(${item.rectCenter.x} ${item.rectCenter.y})`}
              fill="#333"
              style={{ userSelect: 'none', pointerEvents: 'none' }}
            >
              {item.title}
            </text>
          ))}
        </g>
      </svg>

      <div className="center"></div>
    </div>
  )
}

export default CircleSearch
