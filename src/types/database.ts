export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string;
          order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color: string;
          order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          color?: string;
          order?: number;
          created_at?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          color?: string;
          created_at?: string;
        };
      };
      todos: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          note: string;
          due_date: string | null;
          reminder_time: string | null;
          priority: 'low' | 'medium' | 'high';
          category_id: string | null;
          completed: boolean;
          order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          note?: string;
          due_date?: string | null;
          reminder_time?: string | null;
          priority?: 'low' | 'medium' | 'high';
          category_id?: string | null;
          completed?: boolean;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          note?: string;
          due_date?: string | null;
          reminder_time?: string | null;
          priority?: 'low' | 'medium' | 'high';
          category_id?: string | null;
          completed?: boolean;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      todo_tags: {
        Row: {
          todo_id: string;
          tag_id: string;
        };
        Insert: {
          todo_id: string;
          tag_id: string;
        };
        Update: {
          todo_id?: string;
          tag_id?: string;
        };
      };
    };
  };
}
