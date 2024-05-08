import { View, Text, pdf } from '@react-pdf/renderer';
import { createTw } from "react-pdf-tailwind";
import { Button } from './ui/button';
import { Download } from 'lucide-react';
import { cn } from '@/lib/utils';

export const tw = createTw({});

export function TableHeader({ children, className }: { children?: React.ReactElement[]; className?: string }) {
    return (
        <View style={tw(`text-base flex flex-row border items-center ${className}`)}>
            {children}
        </View>
    );
}

export function TableRow({ children, className }: { children?: React.ReactElement[]; className?: string }) {
    return (
        <View wrap={false} style={tw(`text-base flex flex-row border items-center relative ${className}`)}>
            {children}
        </View>
    );
}

export function TableCellText({ text, className }: { text?: string | number; className?: string }) {
    return (
        <Text wrap={false} style={tw(`m-2 mt-3 ${className}`)}>
            {text}
        </Text>
    );
}

export function TableCellView({ children, className }: { children?: React.ReactElement[]; className?: string }) {
    return (
        <View wrap={false} style={tw(`${className}`)}>
            {children}
        </View>
    );
}

export function PreRequisite(
    { text, status, className }:
        { text: string, status: "complete" | "incomplete"; className?: string }) {
    return (
        <Text style={tw(`${status === "complete" ? "bg-green-600" : "bg-red-600"} p-2 rounded pt-3 text-white ${className}`)}
        >
            {text}
        </Text>
    );
}

export function Separator({ width = "1px", className }: { width?: string; className?: string }) {
    return (
        <View style={tw(`h-full w-[${width}] bg-black ${className}`)} />
    );
}

interface PDfDownloadButtonProps { 
    fileName: string; 
    className?: string; 
    buttonText?: string; 
    pdfDocument: React.ReactElement; 
    disabled: boolean 
}

export function PDfDownloadButton(
    { fileName, className, buttonText = "Export", pdfDocument, disabled }: PDfDownloadButtonProps) {
    async function handleDownload() {
        try {
            const blob = await pdf(pdfDocument).toBlob();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const a = document.createElement('a');
            a.style.display = 'none';
            document.body.appendChild(a);
            a.href = url;
            a.setAttribute('download', `${fileName}.pdf`);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Button disabled={disabled} className={cn("gap-1", className)} onClick={handleDownload}>
            <Download size={16} />
            <p className="text-base">{buttonText}</p>
        </Button>
    );
}