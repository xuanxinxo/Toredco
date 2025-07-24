import mongoose, { Document, Model } from 'mongoose';

export interface INews extends Document {
  title: string;
  summary: string;
  date: string;
  image?: string;
  link?: string;
}

const NewsSchema = new mongoose.Schema<INews>({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  date: { type: String, required: true },
  image: { type: String },
  link: { type: String },
});

const News: Model<INews> = mongoose.models.News || mongoose.model<INews>('News', NewsSchema);
export default News;
