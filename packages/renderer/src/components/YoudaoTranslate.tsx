import { useEffect, useState } from 'react'
import { rmstIpcRenderer } from '#preload'
import { Divider, Space, Typography } from '@arco-design/web-react'

const YoudaoTranslate = () => {
  const [fanYiData, setFanYiData] = useState({
    returnPhrase: ['转换'],
    query: '转换',
    errorCode: '0',
    l: 'zh-CHS2en',
    tSpeakUrl:
      'https://openapi.youdao.com/ttsapi?q=convert&langType=en-USA&sign=C4749B70B6EEAD7A3C7CDD0949911C68&salt=1688111372039&voice=4&format=mp3&appKey=2d47366206c6a48b&ttsVoiceStrict=false&osType=api',
    web: [
      { value: ['conversion', 'convert', 'Transform', 'Transition', 'transform'], key: '转换' },
      {
        value: ['Convertible bond', 'convertible debenture', 'Convertible Loan Stock'],
        key: '可转换债券'
      },
      {
        value: ['Converter', 'ADC', 'transducer', 'transformer', 'converter'],
        key: '转换器'
      }
    ],
    requestId: 'c64d27c8-d19d-4b34-bc9e-9a465dec356c',
    translation: ['convert'],
    mTerminalDict: {
      url: 'https://m.youdao.com/m/result?lang=zh-CHS&word=%E8%BD%AC%E6%8D%A2'
    },
    dict: {
      url: 'yddict://m.youdao.com/dict?le=eng&q=%E8%BD%AC%E6%8D%A2'
    },
    webdict: {
      url: 'http://mobile.youdao.com/dict?le=eng&q=%E8%BD%AC%E6%8D%A2'
    },
    basic: {
      phonetic: 'zhuǎn huàn',
      explains: ['transition', 'transform', 'switch', 'shift', 'convert']
    },
    isWord: true,
    speakUrl:
      'https://openapi.youdao.com/ttsapi?q=%E8%BD%AC%E6%8D%A2&langType=zh-CHS&sign=0C7F6670D67D49FEDC022FE054C712D7&salt=1688111372039&voice=4&format=mp3&appKey=2d47366206c6a48b&ttsVoiceStrict=false&osType=api'
  })

  useEffect(() => {
    console.log('useEffect')

    window.electronAPI.onFanyi((evt, data) => {
      console.log(data)
    })

    rmstIpcRenderer.on('fanyi-data', (evt, data) => {
      console.log('fanyi-data', evt)
      console.log('fanyi-data', data)
    })

    // rmstIpcRenderer.invoke('youdao-translate').then(data => {
    //   setFanYiData(data)
    // })
  }, [])

  return (
    <div style={{ padding: 10 }}>
      <div style={{ display: 'flex', gap: 10 }}>
        {fanYiData.basic.explains.map(item => (
          <Typography.Text key={item}>{item}</Typography.Text>
        ))}
      </div>

      <h4>网络</h4>

      {fanYiData.web.map(item => (
        <div key={item.key} style={{ marginTop: 2 }}>
          <Typography.Text style={{ marginRight: 10 }}>{item.key}</Typography.Text>

          <Space size={0} split={<Divider type="vertical" style={{ borderColor: '#aaa' }} />}>
            {item.value.map(value => (
              <Typography.Text key={value}>{value}</Typography.Text>
            ))}
          </Space>
        </div>
      ))}
    </div>
  )
}

export default YoudaoTranslate
