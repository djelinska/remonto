import mongoose, { InferSchemaType, Model } from 'mongoose';
import templateSchema from '../schemas/templateSchema';
import { TemplateFormDto } from '../types/models/template.dto';

const TemplateModel: Model<TemplateFormDto> = mongoose.model('Templates', templateSchema, 'templates');

export default TemplateModel;

