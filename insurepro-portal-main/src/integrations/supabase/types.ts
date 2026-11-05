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
      branches: {
        Row: {
          address: string | null
          city: string
          company_id: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          address?: string | null
          city: string
          company_id: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          address?: string | null
          city?: string
          company_id?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "branches_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string
          email: string | null
          gst_number: string | null
          id: string
          mobile: string | null
          name: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          gst_number?: string | null
          id?: string
          mobile?: string | null
          name: string
          owner_id: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          gst_number?: string | null
          id?: string
          mobile?: string | null
          name?: string
          owner_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      employees: {
        Row: {
          branch_id: string | null
          company_id: string
          created_at: string
          department: string | null
          dob: string | null
          email: string | null
          employee_code: string | null
          first_name: string
          gender: string | null
          id: string
          last_name: string | null
          mobile: string | null
          salary_band: string | null
          updated_at: string
        }
        Insert: {
          branch_id?: string | null
          company_id: string
          created_at?: string
          department?: string | null
          dob?: string | null
          email?: string | null
          employee_code?: string | null
          first_name: string
          gender?: string | null
          id?: string
          last_name?: string | null
          mobile?: string | null
          salary_band?: string | null
          updated_at?: string
        }
        Update: {
          branch_id?: string | null
          company_id?: string
          created_at?: string
          department?: string | null
          dob?: string | null
          email?: string | null
          employee_code?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string | null
          mobile?: string | null
          salary_band?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employees_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_plans: {
        Row: {
          benefits: string[] | null
          coverage_amount: number
          created_at: string
          hospital_network: string | null
          id: string
          is_active: boolean | null
          maternity_coverage: boolean | null
          monthly_premium: number
          name: string
          tier: string
          updated_at: string
          waiting_period_months: number | null
        }
        Insert: {
          benefits?: string[] | null
          coverage_amount: number
          created_at?: string
          hospital_network?: string | null
          id?: string
          is_active?: boolean | null
          maternity_coverage?: boolean | null
          monthly_premium: number
          name: string
          tier: string
          updated_at?: string
          waiting_period_months?: number | null
        }
        Update: {
          benefits?: string[] | null
          coverage_amount?: number
          created_at?: string
          hospital_network?: string | null
          id?: string
          is_active?: boolean | null
          maternity_coverage?: boolean | null
          monthly_premium?: number
          name?: string
          tier?: string
          updated_at?: string
          waiting_period_months?: number | null
        }
        Relationships: []
      }
      insurance_requests: {
        Row: {
          admin_notes: string | null
          base_premium: number | null
          branch_id: string | null
          company_id: string
          created_at: string
          created_by: string | null
          employee_count: number
          id: string
          plan_id: string | null
          request_number: string
          risk_loading: number | null
          status: Database["public"]["Enums"]["request_status"]
          tax: number | null
          total_amount: number | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          base_premium?: number | null
          branch_id?: string | null
          company_id: string
          created_at?: string
          created_by?: string | null
          employee_count?: number
          id?: string
          plan_id?: string | null
          request_number?: string
          risk_loading?: number | null
          status?: Database["public"]["Enums"]["request_status"]
          tax?: number | null
          total_amount?: number | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          base_premium?: number | null
          branch_id?: string | null
          company_id?: string
          created_at?: string
          created_by?: string | null
          employee_count?: number
          id?: string
          plan_id?: string | null
          request_number?: string
          risk_loading?: number | null
          status?: Database["public"]["Enums"]["request_status"]
          tax?: number | null
          total_amount?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "insurance_requests_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_requests_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "insurance_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_records: {
        Row: {
          alcohol: boolean | null
          asthma: boolean | null
          cancer_history: boolean | null
          created_at: string
          current_medications: string | null
          diabetes: boolean | null
          employee_id: string
          existing_diseases: string | null
          heart_disease: boolean | null
          hypertension: boolean | null
          id: string
          pregnancy: boolean | null
          request_id: string
          smoking: boolean | null
        }
        Insert: {
          alcohol?: boolean | null
          asthma?: boolean | null
          cancer_history?: boolean | null
          created_at?: string
          current_medications?: string | null
          diabetes?: boolean | null
          employee_id: string
          existing_diseases?: string | null
          heart_disease?: boolean | null
          hypertension?: boolean | null
          id?: string
          pregnancy?: boolean | null
          request_id: string
          smoking?: boolean | null
        }
        Update: {
          alcohol?: boolean | null
          asthma?: boolean | null
          cancer_history?: boolean | null
          created_at?: string
          current_medications?: string | null
          diabetes?: boolean | null
          employee_id?: string
          existing_diseases?: string | null
          heart_disease?: boolean | null
          hypertension?: boolean | null
          id?: string
          pregnancy?: boolean | null
          request_id?: string
          smoking?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_records_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "insurance_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link: string | null
          read: boolean | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean | null
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          method: string | null
          paid_at: string | null
          request_id: string
          status: Database["public"]["Enums"]["payment_status"]
          transaction_ref: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          method?: string | null
          paid_at?: string | null
          request_id: string
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_ref?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          method?: string | null
          paid_at?: string | null
          request_id?: string
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_ref?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "insurance_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      policies: {
        Row: {
          company_id: string
          coverage_amount: number
          created_at: string
          employee_count: number
          end_date: string
          id: string
          pdf_url: string | null
          plan_id: string
          policy_number: string
          premium_paid: number
          request_id: string
          start_date: string
        }
        Insert: {
          company_id: string
          coverage_amount: number
          created_at?: string
          employee_count: number
          end_date?: string
          id?: string
          pdf_url?: string | null
          plan_id: string
          policy_number?: string
          premium_paid: number
          request_id: string
          start_date?: string
        }
        Update: {
          company_id?: string
          coverage_amount?: number
          created_at?: string
          employee_count?: number
          end_date?: string
          id?: string
          pdf_url?: string | null
          plan_id?: string
          policy_number?: string
          premium_paid?: number
          request_id?: string
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "policies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "policies_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "insurance_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "policies_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: true
            referencedRelation: "insurance_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_id: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      request_employees: {
        Row: {
          employee_id: string
          id: string
          request_id: string
        }
        Insert: {
          employee_id: string
          id?: string
          request_id: string
        }
        Update: {
          employee_id?: string
          id?: string
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "request_employees_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_employees_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "insurance_requests"
            referencedColumns: ["id"]
          },
        ]
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      user_owns_company: { Args: { _company_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "broker"
      payment_status: "pending" | "completed" | "failed"
      request_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "approved"
        | "payment_pending"
        | "payment_completed"
        | "policy_generated"
        | "closed"
        | "rejected"
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
      app_role: ["admin", "broker"],
      payment_status: ["pending", "completed", "failed"],
      request_status: [
        "draft",
        "submitted",
        "under_review",
        "approved",
        "payment_pending",
        "payment_completed",
        "policy_generated",
        "closed",
        "rejected",
      ],
    },
  },
} as const
