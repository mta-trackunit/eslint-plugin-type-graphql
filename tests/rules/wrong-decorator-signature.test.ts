import path from 'path';
import rule from '../../src/rules/wrong-decorator-signature';
import { ESLintUtils } from '@typescript-eslint/experimental-utils';
const { RuleTester } = ESLintUtils;
import {
  createObjectType,
  CREATE_OBJECT_TYPE_CODE_LINE_OFFSET,
  CREATE_OBJECT_TYPE_CODE_COLUMN_OFFSET,
} from '../util/objectType';

const rootDir = path.resolve(__dirname, '../fixtures');

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    tsconfigRootDir: rootDir,
    project: './tsconfig.json',
  },
  parser: '@typescript-eslint/parser',
});

const DEFAULT_ERROR_LOCATION = {
  line: CREATE_OBJECT_TYPE_CODE_LINE_OFFSET,
  column: CREATE_OBJECT_TYPE_CODE_COLUMN_OFFSET + 1,
};

ruleTester.run('wrong-decorator-signature', rule, {
  valid: [
    createObjectType('@Field(() => String)\nmyString!: string;'),
    createObjectType('@Field(() => String, { nullable: true })\nmyString!: string | null;'),
    createObjectType('@Field(() => String, { nullable: true })\nmyString!: string | undefined;'),
    createObjectType("@Field(() => [String], { nullable: 'items' })\nmyArray!: Array<string | null>;"),
    createObjectType("@Field(() => [String], { nullable: 'items' })\nmyArray!: Array<string | undefined>;"),
    createObjectType(
      "@Field(() => [String], { nullable: 'itemsAndList' })\nmyArray!: Array<string | undefined> | null;"
    ),
    createObjectType(
      "@Field(() => [String], { nullable: 'itemsAndList' })\nmyArray!: Array<string | null> | undefined;"
    ),
    createObjectType('@Field(() => [String], { nullable: true })\nmyArray!: string[] | null;'),
    createObjectType('@Field(() => Boolean)\nmyBoolean!: boolean;'),
    createObjectType('@Field(() => Int)\nmyInt!: number;'),
    createObjectType('@Field(() => Float)\nmyFloat!: number;'),
    createObjectType('@Field(() => Date)\nmyDate!: Date;'),
    createObjectType('@Field(() => String)\nmyDate!: Date;'),
    createObjectType("@Field(() => String, { nullable: 'items' })\nmyString!: string"), // <= Decorator is invalid rather than wrong
  ],
  invalid: [
    {
      code: createObjectType('@Field(() => Int)\nmyString!: string;'),
      errors: [{ ...DEFAULT_ERROR_LOCATION, messageId: 'wrongDecoratorType' }],
    },
    {
      code: createObjectType('@Field(() => String)\nmyNumber!: number;'),
      errors: [{ ...DEFAULT_ERROR_LOCATION, messageId: 'wrongDecoratorType' }],
    },
    {
      code: createObjectType('@Field(() => Int)\nmyDate!: Date;'),
      errors: [{ ...DEFAULT_ERROR_LOCATION, messageId: 'wrongDecoratorType' }],
    },
    {
      code: createObjectType('@Field(() => String)\nmyArray!: string[];'),
      errors: [{ ...DEFAULT_ERROR_LOCATION, messageId: 'wrongDecoratorType' }],
    },
    {
      code: createObjectType('@Field(() => [String])\nmyString!: string;'),
      errors: [{ ...DEFAULT_ERROR_LOCATION, messageId: 'wrongDecoratorType' }],
    },
    {
      code: createObjectType('@Field(() => String, { nullable: true })\nmyString!: string;'),
      errors: [{ ...DEFAULT_ERROR_LOCATION, messageId: 'superfluousDecoratorNullableOption' }],
    },
    {
      code: createObjectType('@Field(() => String)\nmyString!: string | null;'),
      errors: [{ ...DEFAULT_ERROR_LOCATION, messageId: 'missingDecoratorNullableOption' }],
    },
    {
      code: createObjectType("@Field(() => [String], { nullable: 'items' })\nmyString!: string[] | null;"),
      errors: [{ ...DEFAULT_ERROR_LOCATION, messageId: 'wrongDecoratorNullableOption' }],
    },
  ],
});