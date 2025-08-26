// src/components/roles/role-form.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { roleCreateSchema, roleUpdateSchema } from "@/lib/roles/schema";
import { z } from "zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

/* =========================
   公開インターフェース（Users の構成に揃える）
   ========================= */

// Create/Update の「入力型」と「変換後型」をそれぞれ定義
// - z.input<typeof schema>  : resolver へ入る前の型（priority は string なども許容）
// - z.output<typeof schema> : resolver で変換・検証後の型（priority は number に確定）
type RoleCreateInput = z.input<typeof roleCreateSchema>;
export type RoleCreateValues = z.output<typeof roleCreateSchema>;

type RoleUpdateInput = z.input<typeof roleUpdateSchema>;
export type RoleUpdateValues = z.output<typeof roleUpdateSchema>;

type BaseProps = {
  onCancel?: () => void;
};

type CreateProps = BaseProps & {
  mode: "create";
  onSubmit: (values: RoleCreateValues) => void;
  onDelete?: never;
  initialValues?: never;
};

type EditProps = BaseProps & {
  mode: "edit";
  initialValues: RoleUpdateValues;
  onSubmit: (values: RoleUpdateValues) => void;
  onDelete?: () => void;
};

type Props = CreateProps | EditProps;

export default function RoleForm(props: Props) {
  return props.mode === "create" ? (
    <CreateForm {...props} />
  ) : (
    <EditForm {...props} />
  );
}

/* =========================
   Create（新規）フォーム
   ========================= */

function CreateForm({ onSubmit, onCancel }: CreateProps) {
  // useForm の 3 つのジェネリクスに
  // <入力型, コンテキスト, 変換後型> を与える
  const form = useForm<RoleCreateInput, undefined, RoleCreateValues>({
    resolver: zodResolver(roleCreateSchema),
    defaultValues: {
      code: "",
      displayName: "",
      // 入力型（RoleCreateInput）的には string/number/unknown を許容するが、
      // 初期値は素直に 0 を与えるのが実用的
      priority: 0,
      badgeColor: "#000000",
      isActive: true,
      canDownloadData: false,
      canEditData: false,
    },
    mode: "onBlur",
  });

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} data-testid="role-form-create">
        <Card className="w-full rounded-md">
          <CardContent className="space-y-6 pt-1">
            <CodeField />
            <DisplayNameField />
            <PriorityField />
            <BadgeColorField />
            <SwitchField name="isActive" label="有効 *" />
            <SwitchField
              name="canDownloadData"
              label="データダウンロード可 *"
            />
            <SwitchField name="canEditData" label="データ編集可 *" />
          </CardContent>

          <CardFooter className="mt-4 flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="cursor-pointer"
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="cursor-pointer"
              data-testid="submit-create"
            >
              登録する
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

/* =========================
   Edit（編集）フォーム
   ========================= */

function EditForm({ initialValues, onSubmit, onCancel, onDelete }: EditProps) {
  const form = useForm<RoleUpdateInput, undefined, RoleUpdateValues>({
    resolver: zodResolver(roleUpdateSchema),
    defaultValues: initialValues,
    mode: "onBlur",
  });

  const handleSubmit = form.handleSubmit(onSubmit);
  const locked = initialValues.isSystem; // 固定ロールは一部ロック

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} data-testid="role-form-edit">
        <Card className="w-full rounded-md">
          <CardContent className="space-y-6 pt-1">
            <DisplayIdField />
            <CodeField disabled={locked} />
            <DisplayNameField />
            <PriorityField disabled={locked} />
            <BadgeColorField />
            <SwitchField name="isActive" label="有効 *" disabled={locked} />
            <SwitchField
              name="canDownloadData"
              label="データダウンロード可 *"
              disabled={locked}
            />
            <SwitchField
              name="canEditData"
              label="データ編集可 *"
              disabled={locked}
            />
            {locked && (
              <FormDescription className="text-xs">
                このロールはシステム既定（固定）です。編集可能なのは「表示名」と「バッジ色」のみです。
              </FormDescription>
            )}
          </CardContent>

          <CardFooter className="mt-4 flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="cursor-pointer"
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="cursor-pointer"
                data-testid="submit-update"
              >
                更新する
              </Button>
            </div>

            {!locked && onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    className="cursor-pointer"
                    data-testid="delete-open"
                  >
                    削除する
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      ロールを論理削除しますか？
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel data-testid="delete-cancel">
                      キャンセル
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onDelete}
                      data-testid="delete-confirm"
                    >
                      削除する
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

/* =========================
   小さなフィールド群
   ========================= */

function CodeField({ disabled }: { disabled?: boolean }) {
  return (
    <FormField
      name="code"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">コード *</FormLabel>
          <FormControl>
            <Input
              {...field}
              disabled={disabled}
              placeholder="ADMIN"
              aria-label="コード"
              data-testid="code"
              className={cn(
                disabled ? "bg-muted border-none focus-visible:ring-0" : "",
              )}
            />
          </FormControl>
          <FormMessage data-testid="code-error" />
        </FormItem>
      )}
    />
  );
}

function DisplayNameField() {
  return (
    <FormField
      name="displayName"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">表示名 *</FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder="管理者"
              aria-label="表示名"
              data-testid="displayName"
            />
          </FormControl>
          <FormMessage data-testid="displayName-error" />
        </FormItem>
      )}
    />
  );
}

function PriorityField({ disabled }: { disabled?: boolean }) {
  return (
    <FormField
      name="priority"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">優先度 *</FormLabel>
          <FormControl>
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              max={999}
              step={1}
              {...field}
              // RHF の field.value は input 側の型（= string | number | unknown）になり得る。
              // そのため、空は ""、それ以外は文字列化してから入れるとチラつきがない。
              value={
                field.value === undefined || field.value === null
                  ? ""
                  : String(field.value)
              }
              onChange={(e) => {
                const v = e.target.value;
                // 空はそのまま空で保持（必須エラーは Zod 側で担保）
                field.onChange(v === "" ? "" : v);
              }}
              placeholder="100"
              aria-label="優先度"
              data-testid="priority"
              disabled={disabled}
              className={cn(
                disabled ? "bg-muted border-none focus-visible:ring-0" : "",
              )}
            />
          </FormControl>
          <FormMessage data-testid="priority-error" />
        </FormItem>
      )}
    />
  );
}

function BadgeColorField() {
  return (
    <FormField
      name="badgeColor"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">バッジ色 *</FormLabel>
          <FormControl>
            {/* 入力とプレビューを兼ねる */}
            <Input
              type="color"
              {...field}
              aria-label="バッジ色"
              data-testid="badgeColor"
              className="cursor-pointer"
            />
          </FormControl>
          <FormMessage data-testid="badgeColor-error" />
        </FormItem>
      )}
    />
  );
}

function SwitchField<
  TName extends "isActive" | "canDownloadData" | "canEditData",
>({
  name,
  label,
  disabled,
}: {
  name: TName;
  label: string;
  disabled?: boolean;
}) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="mt-1 flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <FormLabel className="font-semibold">{label}</FormLabel>
          <FormControl>
            <Switch
              name={field.name}
              checked={Boolean(field.value)}
              onCheckedChange={field.onChange}
              disabled={disabled}
              aria-label={label}
              data-testid={name}
            />
          </FormControl>
          <FormMessage data-testid={`${name}-error`} />
        </FormItem>
      )}
    />
  );
}

function DisplayIdField() {
  return (
    <FormField
      name="displayId"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">表示ID</FormLabel>
          <FormControl>
            <Input
              {...field}
              disabled
              aria-readonly="true"
              data-testid="displayId"
              className="bg-muted border-none focus-visible:ring-0"
            />
          </FormControl>
          <FormMessage data-testid="displayId-error" />
        </FormItem>
      )}
    />
  );
}
