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
      addresses: {
        Row: {
          city: string
          created_at: string
          full_name: string
          id: string
          is_default: boolean
          label: string
          line1: string
          line2: string | null
          phone: string
          postal_code: string
          province: string
          user_id: string
        }
        Insert: {
          city: string
          created_at?: string
          full_name: string
          id?: string
          is_default?: boolean
          label?: string
          line1: string
          line2?: string | null
          phone: string
          postal_code: string
          province: string
          user_id: string
        }
        Update: {
          city?: string
          created_at?: string
          full_name?: string
          id?: string
          is_default?: boolean
          label?: string
          line1?: string
          line2?: string | null
          phone?: string
          postal_code?: string
          province?: string
          user_id?: string
        }
        Relationships: []
      }
      brands: {
        Row: {
          banner_url: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          slug: string
        }
        Insert: {
          banner_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          slug: string
        }
        Update: {
          banner_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          group_name: string | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          parent_slug: string | null
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          group_name?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          parent_slug?: string | null
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          group_name?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          parent_slug?: string | null
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          subject?: string | null
        }
        Relationships: []
      }
      coupons: {
        Row: {
          active: boolean
          code: string
          created_at: string
          ends_at: string | null
          id: string
          max_discount: number | null
          min_subtotal: number
          starts_at: string | null
          type: string
          updated_at: string
          usage_limit: number | null
          used_count: number
          value: number
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          ends_at?: string | null
          id?: string
          max_discount?: number | null
          min_subtotal?: number
          starts_at?: string | null
          type: string
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
          value?: number
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          ends_at?: string | null
          id?: string
          max_discount?: number | null
          min_subtotal?: number
          starts_at?: string | null
          type?: string
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
          value?: number
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          description: string | null
          expense_date: string
          id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: number
          category: string
          created_at?: string
          description?: string | null
          expense_date?: string
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          description?: string | null
          expense_date?: string
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      image_optimization_log: {
        Row: {
          action: string
          alt_text: string | null
          created_at: string
          id: string
          image_url: string
          new_size: number | null
          notes: string | null
          original_size: number | null
          product_id: string | null
          status: string
        }
        Insert: {
          action: string
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url: string
          new_size?: number | null
          notes?: string | null
          original_size?: number | null
          product_id?: string | null
          status?: string
        }
        Update: {
          action?: string
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url?: string
          new_size?: number | null
          notes?: string | null
          original_size?: number | null
          product_id?: string | null
          status?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          line_total: number
          order_id: string
          product_id: string
          product_image: string | null
          product_name: string
          product_slug: string
          quantity: number
          unit_price: number
          variant_label: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          line_total: number
          order_id: string
          product_id: string
          product_image?: string | null
          product_name: string
          product_slug: string
          quantity: number
          unit_price: number
          variant_label?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          line_total?: number
          order_id?: string
          product_id?: string
          product_image?: string | null
          product_name?: string
          product_slug?: string
          quantity?: number
          unit_price?: number
          variant_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          coupon_code: string | null
          created_at: string
          discount: number
          email: string
          id: string
          order_number: string
          payment_method: string
          phone: string
          shipping: number
          shipping_address: Json
          status: string
          subtotal: number
          total: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          coupon_code?: string | null
          created_at?: string
          discount?: number
          email: string
          id?: string
          order_number: string
          payment_method: string
          phone: string
          shipping?: number
          shipping_address: Json
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          coupon_code?: string | null
          created_at?: string
          discount?: number
          email?: string
          id?: string
          order_number?: string
          payment_method?: string
          phone?: string
          shipping?: number
          shipping_address?: Json
          status?: string
          subtotal?: number
          total?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          code: string
          config: Json
          created_at: string
          description: string | null
          id: string
          instructions: string | null
          is_enabled: boolean
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          code: string
          config?: Json
          created_at?: string
          description?: string | null
          id?: string
          instructions?: string | null
          is_enabled?: boolean
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          code?: string
          config?: Json
          created_at?: string
          description?: string | null
          id?: string
          instructions?: string | null
          is_enabled?: boolean
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          id: string
          in_stock: boolean
          label: string
          product_id: string
          sort_order: number
          type: string
          value: string
        }
        Insert: {
          id?: string
          in_stock?: boolean
          label: string
          product_id: string
          sort_order?: number
          type: string
          value: string
        }
        Update: {
          id?: string
          in_stock?: boolean
          label?: string
          product_id?: string
          sort_order?: number
          type?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand_slug: string
          category_slug: string
          compare_at_price: number | null
          created_at: string
          description: string | null
          features: Json
          free_shipping: boolean
          id: string
          image_alts: Json
          images: string[]
          in_stock: boolean
          is_active: boolean
          is_featured: boolean
          is_new_arrival: boolean
          is_on_sale: boolean
          meta_description: string | null
          meta_title: string | null
          name: string
          price: number
          rating: number
          review_count: number
          seo_faq: Json
          seo_keywords: string[]
          seo_updated_at: string | null
          sku: string | null
          slug: string
          specs: Json
          stock_count: number
          subcategory_slug: string | null
          tags: string[]
          updated_at: string
          weight: string | null
        }
        Insert: {
          brand_slug: string
          category_slug: string
          compare_at_price?: number | null
          created_at?: string
          description?: string | null
          features?: Json
          free_shipping?: boolean
          id?: string
          image_alts?: Json
          images?: string[]
          in_stock?: boolean
          is_active?: boolean
          is_featured?: boolean
          is_new_arrival?: boolean
          is_on_sale?: boolean
          meta_description?: string | null
          meta_title?: string | null
          name: string
          price?: number
          rating?: number
          review_count?: number
          seo_faq?: Json
          seo_keywords?: string[]
          seo_updated_at?: string | null
          sku?: string | null
          slug: string
          specs?: Json
          stock_count?: number
          subcategory_slug?: string | null
          tags?: string[]
          updated_at?: string
          weight?: string | null
        }
        Update: {
          brand_slug?: string
          category_slug?: string
          compare_at_price?: number | null
          created_at?: string
          description?: string | null
          features?: Json
          free_shipping?: boolean
          id?: string
          image_alts?: Json
          images?: string[]
          in_stock?: boolean
          is_active?: boolean
          is_featured?: boolean
          is_new_arrival?: boolean
          is_on_sale?: boolean
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          price?: number
          rating?: number
          review_count?: number
          seo_faq?: Json
          seo_keywords?: string[]
          seo_updated_at?: string | null
          sku?: string | null
          slug?: string
          specs?: Json
          stock_count?: number
          subcategory_slug?: string | null
          tags?: string[]
          updated_at?: string
          weight?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          name: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          address: string | null
          announcement_enabled: boolean
          announcement_link: string | null
          announcement_text: string | null
          cod_fee: number
          created_at: string
          currency_code: string
          currency_decimals: number
          currency_locale: string
          currency_symbol: string
          default_og_image: string | null
          delivery_days_max: number
          delivery_days_min: number
          description_template: string
          free_shipping_threshold: number
          id: string
          local_business_json_ld: Json
          logo_url: string | null
          org_json_ld: Json
          promo: Json
          shipping_fee: number
          singleton: boolean
          site_name: string
          social: Json
          support_email: string | null
          support_phone: string | null
          tagline: string | null
          title_template: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          announcement_enabled?: boolean
          announcement_link?: string | null
          announcement_text?: string | null
          cod_fee?: number
          created_at?: string
          currency_code?: string
          currency_decimals?: number
          currency_locale?: string
          currency_symbol?: string
          default_og_image?: string | null
          delivery_days_max?: number
          delivery_days_min?: number
          description_template?: string
          free_shipping_threshold?: number
          id?: string
          local_business_json_ld?: Json
          logo_url?: string | null
          org_json_ld?: Json
          promo?: Json
          shipping_fee?: number
          singleton?: boolean
          site_name?: string
          social?: Json
          support_email?: string | null
          support_phone?: string | null
          tagline?: string | null
          title_template?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          announcement_enabled?: boolean
          announcement_link?: string | null
          announcement_text?: string | null
          cod_fee?: number
          created_at?: string
          currency_code?: string
          currency_decimals?: number
          currency_locale?: string
          currency_symbol?: string
          default_og_image?: string | null
          delivery_days_max?: number
          delivery_days_min?: number
          description_template?: string
          free_shipping_threshold?: number
          id?: string
          local_business_json_ld?: Json
          logo_url?: string | null
          org_json_ld?: Json
          promo?: Json
          shipping_fee?: number
          singleton?: boolean
          site_name?: string
          social?: Json
          support_email?: string | null
          support_phone?: string | null
          tagline?: string | null
          title_template?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_list_customers: {
        Args: never
        Returns: {
          avatar_url: string
          created_at: string
          is_admin: boolean
          name: string
          order_count: number
          phone: string
          total_spent: number
          user_id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "customer"
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
    Enums: {
      app_role: ["admin", "customer"],
    },
  },
} as const
