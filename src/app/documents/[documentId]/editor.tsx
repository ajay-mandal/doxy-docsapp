'use client'

import { useLiveblocksExtension } from "@liveblocks/react-tiptap";
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import ImageResize from "tiptap-extension-resize-image"
import FontFamily from "@tiptap/extension-font-family"
import TextStyle from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import { Color } from '@tiptap/extension-color'

import { useEditorStore } from '@/store/use-editor-store'
import { FontSizeExtension } from "@/extensions/font-size"
import { LineHeightExtension } from "@/extensions/line-height"
import { Ruler } from './ruler'
import { Threads } from "./threads";



const Editor = () => {
  const { setEditor } = useEditorStore();
  const liveblocks = useLiveblocksExtension();

  const editor = useEditor({
    onCreate({ editor}) {
      setEditor(editor);
    },
    onDestroy() {
      setEditor(null);
    },
    onUpdate({ editor}) {
      setEditor(editor);
    },
    onSelectionUpdate({ editor}) {
      setEditor(editor);
    },
    onTransaction({ editor}) {
      setEditor(editor);
    },
    onFocus({ editor}) {
      setEditor(editor);
    },
    onBlur({ editor}) {
      setEditor(editor);
    },
    onContentError({ editor}) {
      setEditor(editor);
    },
    immediatelyRender: false,
    editorProps: {
        attributes: {
            style:" padding-left: 56px; padding-right: 56px;",
            class: "focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text"
        }
    },
    extensions: [
      liveblocks,
      StarterKit.configure({
        history: false,
      }),
      LineHeightExtension.configure({
        types: ['heading', 'paragraph'],
        defaultLineHeight: "normal"
      }),
      FontSizeExtension,
      TextAlign.configure({
        types: ["heading", "paragraph"]
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https"
      }),
      Color,
      Highlight.configure({
        multicolor: true
      }),
      FontFamily,
      TextStyle,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image,
      ImageResize,
      Underline
    ],
  })

  return(
    <div className='size-full overflow-x-auto bg-[#F9FBFD] px-4 print:p-0 print:bg-white pring:overflow-visible'>
      <Ruler />
        <div className='min-w-max flex justify-center w-[816px] py-4 print:py-0 print:w-full mx-auto print:min-w-0 '>
         <EditorContent editor={editor} />
         <Threads editor={editor} />
        </div>
    </div>
  )
}

export default Editor
