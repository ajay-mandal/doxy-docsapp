"use client";
import Image from "next/image";
import Link from "next/link";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

import { DocumentInput } from "./document-input";
import { useEditorStore } from "@/store/use-editor-store";

import { 
    Menubar, 
    MenubarContent, 
    MenubarItem, 
    MenubarMenu, 
    MenubarSeparator, 
    MenubarShortcut, 
    MenubarSub, 
    MenubarSubContent, 
    MenubarSubTrigger, 
    MenubarTrigger 
} from "@/components/ui/menubar";

import { 
    FileIcon, 
    FileJsonIcon, 
    FilePenIcon, 
    FilePlusIcon, 
    FileTextIcon, 
    GlobeIcon,
    PrinterIcon, 
    Redo2Icon,
    RemoveFormattingIcon,
    TextIcon, 
    TrashIcon,
    Undo2Icon
} from "lucide-react";

import { BsFilePdf, BsTypeBold } from "react-icons/bs";
import { MdStrikethroughS, MdFormatUnderlined, MdFormatItalic } from "react-icons/md";

const Navbar = () => {

    const { editor } = useEditorStore();

    const insertTable = ({ rows, cols }: { rows: number, cols: number}) => {
        editor
        ?.chain()
        .focus()
        .insertTable({ rows, cols, withHeaderRow: false})
        .run()
    };

    const onDownload = (blob: Blob, filename: string) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
    };

    const onSaveJSON = () => {
        if(!editor) return;

        const content = editor.getJSON();
        const blob = new Blob([JSON.stringify(content)], {
            type: "application/json"
        });
        onDownload(blob, 'document.json') // TODO: Use document name from DB
    }

    const onSaveHTML = () => {
        if(!editor) return;

        const content = editor.getHTML();
        const blob = new Blob([content], {
            type: "text/html"
        });
        onDownload(blob, 'document.html') // TODO: Use document name from DB
    }

    const onSaveText = () => {
        if(!editor) return;

        const content = editor.getText();
        const blob = new Blob([content], {
            type: "text/plain"
        });
        onDownload(blob, 'document.txt') // TODO: Use document name from DB
    }

    const onSavePDF = async () => {
        if(!editor) return;
        
        try {
            const editorElement = document.querySelector('.ProseMirror');
            if (!editorElement) return;
            
            const canvas = await html2canvas(editorElement as HTMLElement, {
                scale: 3,
                useCORS: true,
                logging: false,
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'pt',
                format: 'a4'
            });
            
            const imgWidth = pdf.internal.pageSize.getWidth();
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save('document.pdf'); // TODO: Use document name 
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    }
    return (
        <nav className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
                <Link href="/" className="p-0.5">
                    <Image src="/logo_only.svg" alt="Logo" width={28} height={28}/>
                </Link>
                <div className="flex flex-col">
                    <DocumentInput />
                    <div className="flex">
                        <Menubar className="border-none bg-transparent shadow-none h-auto p-0">
                            <MenubarMenu>
                                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                                    File
                                </MenubarTrigger>
                                <MenubarContent className="print:hidden">
                                    <MenubarSub>
                                        <MenubarSubTrigger>
                                            <FileIcon className="size-4 mr-2"/>
                                            Save
                                        </MenubarSubTrigger>
                                        <MenubarSubContent>
                                            <MenubarItem onClick={onSaveJSON}>
                                                <FileJsonIcon className="size-4 mr-2" />
                                                JSON
                                            </MenubarItem>
                                            <MenubarItem onClick={onSaveHTML}>
                                                <GlobeIcon className="size-4 mr-2" />
                                                HTML
                                            </MenubarItem>
                                            <MenubarItem onClick={onSavePDF}>
                                                <BsFilePdf className="size-4 mr-2" />
                                                PDF
                                            </MenubarItem>
                                            <MenubarItem onClick={onSaveText}>
                                                <FileTextIcon className="size-4 mr-2" />
                                                Text
                                            </MenubarItem>
                                        </MenubarSubContent>
                                    </MenubarSub>
                                    <MenubarItem>
                                        <FilePlusIcon className="size-4 mr-2" />
                                        New Document
                                    </MenubarItem>
                                    <MenubarSeparator />
                                    <MenubarItem>
                                        <FilePenIcon className="size-4 mr-2" />
                                        Rename
                                    </MenubarItem>
                                    <MenubarItem>
                                        <TrashIcon className="size-4 mr-2" />
                                        Remove
                                    </MenubarItem>
                                    <MenubarSeparator />
                                    <MenubarItem onClick={() => window.print()}>
                                        <PrinterIcon className="size-4 mr-2" />
                                        Print <MenubarShortcut>&#8984;P</MenubarShortcut>
                                    </MenubarItem>
                                </MenubarContent>
                            </MenubarMenu>
                            <MenubarMenu>
                                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                                    Edit
                                </MenubarTrigger>
                                <MenubarContent>
                                    <MenubarItem onClick={() => editor?.chain().focus().undo().run()}>
                                        <Undo2Icon className="size-4 mr-2" />
                                        Undo<MenubarShortcut>&#8984;Z</MenubarShortcut>
                                    </MenubarItem>
                                    <MenubarItem onClick={() => editor?.chain().focus().redo().run()}>
                                        <Redo2Icon className="size-4 mr-2" />
                                        Redo<MenubarShortcut>&#8984;Y</MenubarShortcut>
                                    </MenubarItem>
                                </MenubarContent>
                            </MenubarMenu>
                            <MenubarMenu>
                                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                                    Insert
                                </MenubarTrigger>
                                <MenubarContent>
                                    <MenubarSub>
                                        <MenubarSubTrigger>Table</MenubarSubTrigger>
                                        <MenubarSubContent>
                                            <MenubarItem onClick={() => insertTable({ rows: 1, cols: 1})}> 
                                                1 x 1
                                            </MenubarItem>
                                            <MenubarItem onClick={() => insertTable({ rows: 2, cols: 2})}>
                                                2 x 2
                                            </MenubarItem>
                                            <MenubarItem onClick={() => insertTable({ rows: 3, cols: 3})}>
                                                3 x 3
                                            </MenubarItem>
                                            <MenubarItem onClick={() => insertTable({ rows: 4, cols: 4})}>
                                                4 x 4
                                            </MenubarItem>
                                        </MenubarSubContent>    
                                    </MenubarSub>
                                </MenubarContent>
                            </MenubarMenu>
                            <MenubarMenu>
                                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">
                                    Format
                                </MenubarTrigger>
                                <MenubarContent>
                                    <MenubarSub>
                                        <MenubarSubTrigger>
                                            <TextIcon className="size-4 mr-2" />
                                            Text
                                        </MenubarSubTrigger>
                                        <MenubarSubContent>
                                            <MenubarItem onClick={() => editor?.chain().focus().toggleBold().run()}>
                                                <BsTypeBold className="size-4 mr-2"/>
                                                Bold <MenubarShortcut>&#8984;B</MenubarShortcut>
                                            </MenubarItem>
                                            <MenubarItem onClick={() => editor?.chain().focus().toggleItalic().run()}>
                                                <MdFormatItalic className="size-4 mr-2"/>
                                                Italic <MenubarShortcut>&#8984;I</MenubarShortcut>
                                            </MenubarItem>
                                            <MenubarItem onClick={() => editor?.chain().focus().toggleUnderline().run()}>
                                                <MdFormatUnderlined className="size-4 mr-2"/>
                                                Underline <MenubarShortcut>&#8984;U</MenubarShortcut>
                                            </MenubarItem>
                                            <MenubarItem onClick={() => editor?.chain().focus().toggleStrike().run()}>
                                                <MdStrikethroughS className="size-4 mr-2"/>
                                                Strike-through &nbsp;&nbsp;&nbsp;<MenubarShortcut>&#8984;+Shift+S</MenubarShortcut>
                                            </MenubarItem>
                                        </MenubarSubContent>
                                    </MenubarSub>
                                    <MenubarItem onClick={()=> editor?.chain().focus().unsetAllMarks().run()}>
                                        <RemoveFormattingIcon className="size-4 mr-2" />
                                        Remove Formatting
                                    </MenubarItem>
                                </MenubarContent>
                            </MenubarMenu>
                        </Menubar>
                    </div>
                </div>
            </div>
            <div className="flex gap-3 items-center pl-6">
                <OrganizationSwitcher 
                afterCreateOrganizationUrl="/"
                afterLeaveOrganizationUrl="/"
                afterSelectOrganizationUrl="/"
                afterSelectPersonalUrl="/"
                />
                <UserButton />
            </div>
        </nav>
    )
}

export default Navbar;