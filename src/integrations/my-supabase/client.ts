// 已废弃 — 外部 Supabase 实例统一通过 src/integrations/supabase/client.ts 连接。
// 如需在旧代码中使用 mySupabase，改为：
//   import { supabase as mySupabase } from '@/integrations/supabase/client'
// 本文件将在 Phase 4 前台迁移完成后彻底删除。
export { supabase as mySupabase } from '@/integrations/supabase/client';
