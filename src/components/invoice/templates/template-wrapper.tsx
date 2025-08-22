import type { FC, ReactNode } from "react";

interface TemplateWrapperProps {
    children: ReactNode;
}

export const TemplateWrapper: FC<TemplateWrapperProps> = ({ children }) => {
    return (
        <div id="invoice-preview-area" className="aspect-[8.5/11] w-full bg-white shadow-lg rounded-lg overflow-hidden border">
            {children}
        </div>
    )
}
