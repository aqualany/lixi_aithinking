export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      site_settings: {
        Row: {
          id: string; site_title: string; site_description: string; seo_keywords: string[];
          author_name: string; author_name_en: string; hero_eyebrow: string;
          bio_lines: string[]; tags: string[];
          avatar_media_id: string | null; github_url: string; contact_email: string;
          admin_user_id: string | null;
          created_at: string; updated_at: string;
        }
        Insert: {
          id?: string; site_title: string; site_description?: string; seo_keywords?: string[];
          author_name: string; author_name_en?: string; hero_eyebrow?: string;
          bio_lines?: string[]; tags?: string[];
          avatar_media_id?: string | null; github_url?: string; contact_email?: string;
          admin_user_id?: string | null;
        }
        Update: {
          site_title?: string; site_description?: string; seo_keywords?: string[];
          author_name?: string; author_name_en?: string; hero_eyebrow?: string;
          bio_lines?: string[]; tags?: string[];
          avatar_media_id?: string | null; github_url?: string; contact_email?: string;
          admin_user_id?: string | null;
        }
        Relationships: []
      }
      pages: {
        Row: { id: string; slug: string; title: string; description: string; is_visible: boolean; sort_order: number; created_at: string; updated_at: string }
        Insert: { id?: string; slug: string; title: string; description?: string; is_visible?: boolean; sort_order?: number }
        Update: { slug?: string; title?: string; description?: string; is_visible?: boolean; sort_order?: number }
        Relationships: []
      }
      navigation: {
        Row: { id: string; location: string; label: string; href: string; is_external: boolean; sort_order: number; is_visible: boolean; created_at: string; updated_at: string }
        Insert: { id?: string; location: string; label: string; href: string; is_external?: boolean; sort_order?: number; is_visible?: boolean }
        Update: { location?: string; label?: string; href?: string; is_external?: boolean; sort_order?: number; is_visible?: boolean }
        Relationships: []
      }
      content_types: {
        Row: { id: string; slug: string; name: string; description: string; schema: any; sort_order: number; created_at: string; updated_at: string }
        Insert: { id?: string; slug: string; name: string; description?: string; schema?: any; sort_order?: number }
        Update: { slug?: string; name?: string; description?: string; schema?: any; sort_order?: number }
        Relationships: []
      }
      posts: {
        Row: { id: string; content_type_id: string; slug: string; title: string; subtitle: string; summary: string; cover_media_id: string | null; body_md: string; status: string; published_at: string | null; sort_order: number; extra: any; created_at: string; updated_at: string }
        Insert: { id?: string; content_type_id: string; slug: string; title: string; subtitle?: string; summary?: string; cover_media_id?: string | null; body_md?: string; status?: string; published_at?: string | null; sort_order?: number; extra?: any }
        Update: { content_type_id?: string; slug?: string; title?: string; subtitle?: string; summary?: string; cover_media_id?: string | null; body_md?: string; status?: string; published_at?: string | null; sort_order?: number; extra?: any }
        Relationships: [{ type: "foreign"; references: { table: "content_types"; columns: ["id"] }; foreignKeyName: "posts_content_type_id_fkey" }]
      }
      post_sections: {
        Row: { id: string; post_id: string; anchor: string; title: string; sort_order: number; created_at: string; updated_at: string }
        Insert: { id?: string; post_id: string; anchor: string; title: string; sort_order?: number }
        Update: { post_id?: string; anchor?: string; title?: string; sort_order?: number }
        Relationships: [{ type: "foreign"; references: { table: "posts"; columns: ["id"] }; foreignKeyName: "post_sections_post_id_fkey" }]
      }
      media: {
        Row: { id: string; storage_path: string; public_url: string; alt: string; width: number | null; height: number | null; mime_type: string; created_at: string; updated_at: string }
        Insert: { id?: string; storage_path: string; public_url?: string; alt?: string; width?: number | null; height?: number | null; mime_type?: string }
        Update: { storage_path?: string; public_url?: string; alt?: string; width?: number | null; height?: number | null; mime_type?: string }
        Relationships: []
      }
      custom_blocks: {
        Row: { id: string; page_id: string | null; title: string | null; image_media_id: string | null; link_url: string; placement: string; sort_order: number; is_visible: boolean; created_at: string; updated_at: string }
        Insert: { id?: string; page_id?: string | null; title?: string | null; image_media_id?: string | null; link_url?: string; placement?: string; sort_order?: number; is_visible?: boolean }
        Update: { page_id?: string | null; title?: string | null; image_media_id?: string | null; link_url?: string; placement?: string; sort_order?: number; is_visible?: boolean }
        Relationships: [{ type: "foreign"; references: { table: "pages"; columns: ["id"] }; foreignKeyName: "custom_blocks_page_id_fkey" }]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
