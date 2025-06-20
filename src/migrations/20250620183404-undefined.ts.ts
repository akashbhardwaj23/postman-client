import { Migration } from '@mikro-orm/migrations';

export class Migration20250620183404 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "historical_request" ("id" serial primary key, "method" varchar(255) not null, "url" varchar(255) not null, "request_headers" jsonb null, "request_body" text null, "status_code" int null, "response_headers" jsonb null, "response_body" text null, "timestamp" timestamptz not null);`);
  }

}
