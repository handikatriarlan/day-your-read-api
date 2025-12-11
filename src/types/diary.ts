export enum Mood {
  HAPPY = "HAPPY",
  SAD = "SAD",
  EXCITED = "EXCITED",
  ANXIOUS = "ANXIOUS",
  CALM = "CALM",
  ANGRY = "ANGRY",
  GRATEFUL = "GRATEFUL",
  TIRED = "TIRED",
  MOTIVATED = "MOTIVATED",
  CONFUSED = "CONFUSED",
}

export interface CreateDiaryRequest {
  title: string
  content: string
  mood?: Mood
  isPublic?: boolean
  tagIds?: number[]
}

export interface UpdateDiaryRequest {
  title?: string
  content?: string
  mood?: Mood | null
  isPublic?: boolean
  tagIds?: number[]
}

export interface DiaryFilters {
  mood?: Mood
  tagIds?: number[]
  startDate?: Date
  endDate?: Date
  search?: string
  isPublic?: boolean
}

export interface CreateTagRequest {
  name: string
  color?: string
}

export interface UpdateTagRequest {
  name?: string
  color?: string
}
