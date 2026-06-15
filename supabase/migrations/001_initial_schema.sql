-- Trae Todo App - Initial Schema
-- Run this in Supabase SQL Editor or via Supabase CLI

create extension if not exists "pgcrypto";

-- Categories
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text not null,
  "order" integer not null default 0,
  created_at timestamptz not null default now()
);

create index categories_user_id_idx on public.categories(user_id);

-- Tags
create table public.tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text not null,
  created_at timestamptz not null default now()
);

create index tags_user_id_idx on public.tags(user_id);

-- Todos
create table public.todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  note text not null default '',
  due_date timestamptz,
  reminder_time timestamptz,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  category_id uuid references public.categories(id) on delete set null,
  completed boolean not null default false,
  "order" integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index todos_user_id_idx on public.todos(user_id);
create index todos_category_id_idx on public.todos(category_id);

-- Todo-Tag junction
create table public.todo_tags (
  todo_id uuid not null references public.todos(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (todo_id, tag_id)
);

create index todo_tags_todo_id_idx on public.todo_tags(todo_id);
create index todo_tags_tag_id_idx on public.todo_tags(tag_id);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger todos_updated_at
  before update on public.todos
  for each row execute function public.handle_updated_at();

-- Row Level Security
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.todos enable row level security;
alter table public.todo_tags enable row level security;

-- Categories policies
create policy "Users can view own categories"
  on public.categories for select
  using (auth.uid() = user_id);

create policy "Users can insert own categories"
  on public.categories for insert
  with check (auth.uid() = user_id);

create policy "Users can update own categories"
  on public.categories for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own categories"
  on public.categories for delete
  using (auth.uid() = user_id);

-- Tags policies
create policy "Users can view own tags"
  on public.tags for select
  using (auth.uid() = user_id);

create policy "Users can insert own tags"
  on public.tags for insert
  with check (auth.uid() = user_id);

create policy "Users can update own tags"
  on public.tags for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own tags"
  on public.tags for delete
  using (auth.uid() = user_id);

-- Todos policies
create policy "Users can view own todos"
  on public.todos for select
  using (auth.uid() = user_id);

create policy "Users can insert own todos"
  on public.todos for insert
  with check (auth.uid() = user_id);

create policy "Users can update own todos"
  on public.todos for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own todos"
  on public.todos for delete
  using (auth.uid() = user_id);

-- Todo tags policies
create policy "Users can view own todo_tags"
  on public.todo_tags for select
  using (
    exists (
      select 1 from public.todos
      where todos.id = todo_tags.todo_id and todos.user_id = auth.uid()
    )
  );

create policy "Users can insert own todo_tags"
  on public.todo_tags for insert
  with check (
    exists (
      select 1 from public.todos
      where todos.id = todo_tags.todo_id and todos.user_id = auth.uid()
    )
  );

create policy "Users can delete own todo_tags"
  on public.todo_tags for delete
  using (
    exists (
      select 1 from public.todos
      where todos.id = todo_tags.todo_id and todos.user_id = auth.uid()
    )
  );
