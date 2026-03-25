export type ScentLog = {
  idx?: number; //automated PK
  userId: string;
  date: string;
  perfId: string;
  orderIdx: number;
  details?: any; //parsed object from details_json
};
