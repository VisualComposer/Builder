import React, { useRef, useEffect, forwardRef } from 'react'
import CodeEditor from 'public/components/codeEditor/codeEditor'

interface CodeEditorFace {
  current: {
    getValue: () => void
    refresh: () => void
  }
}

interface Value {
  all: string
}

interface Props {
  value: Value
  updater: (arg0: string, arg1: Value, arg2: null, arg3: string) => void
  fieldKey: string
  fieldType: string
}

const StyleEditorAttribute = forwardRef((props: Props) => {
  const editorWrapper = useRef<HTMLTextAreaElement>(null)
  // @ts-ignore
  const codeEditor: CodeEditorFace = useRef(null)

  const handleChange = () => {
    // @ts-ignore
    const val = codeEditor?.current?.getValue() || ''
    const {
      updater,
      fieldKey,
      fieldType
    } = props
    updater(fieldKey, { all: val }, null, fieldType)
  }

  useEffect(() => {
    const defaultValue = '[element-id] {\n}'
    const editor = CodeEditor.getEditor(editorWrapper.current, 'css', props.value.all || defaultValue)
    editor.setSize('100%', '50vh')
    editor.on('change', handleChange)
    codeEditor.current = editor
  }, [])

  useEffect(() => {
    codeEditor?.current?.refresh()
  }, [props.value])

  return (
    <div>
      <textarea className="vcv-ui-style-ace-container" ref={editorWrapper} />
    </div>
  )
})

StyleEditorAttribute.displayName = 'StyleEditorAttribute'

export default StyleEditorAttribute
