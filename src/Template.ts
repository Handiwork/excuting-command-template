
export interface Template {
  name: string;
  value: string ;
}

export interface TemplateFolder {
  name: string;
  children: TemplateFolderContent;
}

export type TemplateFolderContent = Array<TemplateFolder | Template>;

export interface TemplateFolderEntry {
  type: "templateFolder";
  templateFolder: TemplateFolder;
  parent?: TemplateFolder;
}

export interface TemplateEntry {
  type: "template";
  template: Template;
  parent?: TemplateFolder;
}

export type TEntry = TemplateEntry | TemplateFolderEntry;

export function getEntry(data: Template | TemplateFolder, parent?: TemplateFolder): TEntry {
  if ((data as TemplateFolder).children) {
    return { type: "templateFolder", templateFolder: data as TemplateFolder, parent };
  } else {
    return { type: "template", template: data as Template, parent };
  }
}