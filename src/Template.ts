
export interface Template {
  name: string;
  value?: string;
  children?: Template[]
}

export interface TemplateEntry{
  
}

export interface TemplateFolder {
  name: string;
  children: TemplateFolderContent;
}

export type TemplateFolderContent = Array<TemplateFolder | Template>;

export interface TemplateFolderEntry {
  type: "templateFolder";
  templateFolder: TemplateFolder;
  parent?: TemplateFolderEntry;
}

export interface TemplateEntry {
  type: "template";
  template: Template;
  parent?: TemplateFolderEntry;
}

export type TEntry = TemplateEntry | TemplateFolderEntry;

export function getEntry(data: Template | TemplateFolder, parent?: TemplateFolderEntry): TEntry {
  if ((data as TemplateFolder).children)
    return { type: "templateFolder", templateFolder: data as TemplateFolder, parent };
  else
    return { type: "template", template: data as Template, parent };
}