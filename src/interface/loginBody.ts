export interface LoginBody {
  status: boolean
  code: number
  message: string
  token: string
  user_role: number
  student?: Student
  staff?: Staff
}
export interface Student {
  id: number
  user_number: number
  name: string
  dob: string
  grade: string
  gender: string
  ethnicity: string
  race: string
  address: string
  secondary_phone: string
  profile_photo: string
  english_level: string
  highland_phone: number
  is_chat: boolean
  is_suspended: boolean
  student_id: number
  signature: string
  last_time_visited: number
  created_at: number
  school_phone: string
  primary_language: string
  school_id: number
  enroll_date: string
  user_id: number
  chat_id: number
  login_done: boolean
  first_name: string
  last_name: string
  nick_name: string
  ps_profile_image: string
  notify: boolean
  available_from: string
  available_to: string
  onboarded: boolean
  english_proficiency: string
  _user: User
  _student_language?: StudentLanguageEntity[] | null
}
export interface User {
  email: string
  is_zoom_invited: boolean
  zoom_ids: string
  zoom_network_code: number
  is_zoom_invitation_accepted: boolean
}
export interface StudentLanguageEntity {
  id: number
  created_at: number
  students_id: number
  languages_id: number
  _languages: Languages
}
export interface Languages {
  id: number
  name: string
  short_name: string
  primary_language_id: string
  native_utf: string
  flag_image: string
  rank_order: number
  created_at: number
  is_present_in_microsoft: boolean
}

export interface Staff {
  id: number
  created_at: number
  name: string
  phone: string
  school_id: number
  staff_id: number
  user_id: number
  profile_photo: string
  schoolphone: string
  street: string
  city: string
  state: string
  zip: number
  chat_id: number
  login_done: boolean
  title: string
  first_name: string
  last_name: string
  nick_name: string
  role?: string[] | undefined
  notify: boolean
  available_from: number
  available_to: number
  is_active: number
  vax_image: string
  vax_status: string
  last_time_visited: number
  signature: string
  _user: User
  _staff_language?: StaffLanguageEntity[] | null
}
export interface User {
  email: string
}
export interface StaffLanguageEntity {
  id: number
  created_at: number
  students_id: number
  languages_id: number
  _languages: Languages
}
export interface Languages {
  id: number
  name: string
  short_name: string
  primary_language_id: string
  native_utf: string
  flag_image: string
  rank_order: number
  created_at: number
  is_present_in_microsoft: boolean
}

export interface LanguageData {
  id: number
  name: string
  short_name: string
  primary_language_id: string
  native_utf: string
  flag_image: string
}
