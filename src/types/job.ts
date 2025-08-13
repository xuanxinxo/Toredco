export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  description: string;
  requirements: string[];
  benefits: string[];
  deadline?: string;
  status: string;
  postedDate: string;
  img?: string;
}

export interface JobPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface JobResponse {
  jobs: Job[];
  pagination: JobPagination;
  totalJobs: number;
}
