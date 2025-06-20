// lib/entities.ts
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class HistoricalRequest {
  @PrimaryKey()
  id!: number;

  @Property()
  method!: string; // GET, POST, PUT, DELETE

  @Property()
  url!: string;

  @Property({ type: 'json', nullable: true })
  requestHeaders?: object; // Store as JSON string or object

  @Property({ type: 'text', nullable: true })
  requestBody?: string; // Store as raw text/JSON string

  @Property({ nullable: true })
  statusCode?: number;

  @Property({ type: 'json', nullable: true })
  responseHeaders?: object; // Store as JSON string or object

  @Property({ type: 'text', nullable: true })
  responseBody?: string; // Store as raw text/JSON string

  @Property({ onCreate: () => new Date() }) // Automatically set on creation
  timestamp: Date = new Date();

  constructor(method: string, url: string) {
    this.method = method;
    this.url = url;
  }
}