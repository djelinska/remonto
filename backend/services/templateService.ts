import mongoose, { Types } from 'mongoose';
import TemplateModel from '../models/templateModel';
import { TemplateFormDto } from '../types/models/template.dto';
import ReturnMessage from '../types/models/returnMessage.model';

type ObjectId = Types.ObjectId;

type TemplateList = Array<{ id: Types.ObjectId; name: string }>;

// Fetch all templates
export const fetchTemplates = async (): Promise<TemplateList> => {
  try {
    const templates = await TemplateModel.find();

    if (!templates.length) {
      throw new Error('No templates found');
    }

    return templates.map((template) => ({
      id: template._id,
      name: template.project.name,
    }));
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw new Error('Error fetching templates');
  }
};

// Fetch a single template by ID
export const fetchTemplateById = async (templateId: ObjectId): Promise<TemplateFormDto> => {
  try {
    const template = await TemplateModel.findById(templateId);

    if (!template) {
      throw new Error('Template not found');
    }

    return template;
  } catch (error) {
    console.error('Error fetching template:', error);
    throw new Error('Error fetching template');
  }
};

// Create a new template
export const createTemplate = async (newTemplate: TemplateFormDto): Promise<TemplateFormDto> => {
  try {
    const template = new TemplateModel(newTemplate);

    await template.save();

    return template;
  } catch (error) {
    console.error('Error creating template:', error);
    throw new Error('Error creating template');
  }
};

// Update an existing template
export const updateTemplate = async (templateId: ObjectId, updatedTemplate: TemplateFormDto): Promise<TemplateFormDto> => {
  try {
    const template = await TemplateModel.findByIdAndUpdate(templateId, { $set: updatedTemplate }, { new: true, runValidators: true });

    if (!template) {
      throw new Error('Template not found');
    }

    return template;
  } catch (error) {
    console.error('Error updating template:', error);
    throw new Error('Error updating template');
  }
};

// Delete a template
export const deleteTemplate = async (templateId: ObjectId): Promise<ReturnMessage> => {
  try {
    const result = await TemplateModel.findByIdAndDelete(templateId);

    if (!result) {
      throw new Error('Template not found');
    }

    return {
      message: 'Template deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting template:', error);
    throw new Error('Error deleting template');
  }
};

