export type Challenge = {
  id: string;
  slug: string;
  title: string;
  description: string;
  start_date: string;
  duration_days: number;
  timezone: string;
  enrollment_opens_at: string;
  enrollment_closes_at: string;
  rules: string[];
  rules_version: string;
  published: boolean;
};
export type Mission = {
  id: string;
  challenge_id: string;
  day: number;
  phase: string;
  title: string;
  purpose: string;
  guide: string;
  completion_criteria: string;
};
export type Participation = {
  id: string;
  user_id: string;
  challenge_id: string;
  joined_at: string;
  rules_version: string;
};
export type Overview = {
  challenge: Challenge;
  current_day: number;
  can_join: boolean;
  server_now: string;
};
export type HomeData = Overview & {
  participation: Participation;
  today_mission: Mission | null;
  total_score: number;
};
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
// RPC contracts are versioned with the SQL migration. No browser write path for scores.
export type Database = {
  public: {
    Tables: { [K in never]: never };
    Views: { [K in never]: never };
    Functions: {
      proof_result: { Args: { p_mission_id: string }; Returns: Json };
      mission_detail: { Args: { p_mission_id: string }; Returns: Json };
      mission_board: { Args: { p_slug: string }; Returns: Json };
      challenge_overview: { Args: { p_slug: string }; Returns: Json };
      participant_home: { Args: { p_slug: string }; Returns: Json };
      join_challenge: {
        Args: { p_challenge_id: string; p_rules_version: string };
        Returns: string;
      };
    };
    Enums: { [K in never]: never };
    CompositeTypes: { [K in never]: never };
  };
};
