import type { Listing, Monitor } from "@/types";

export const demoMonitors: Monitor[] = [
  { id: "m1", title: "iPhone 15 Pro", query: "iPhone 15 Pro 256GB", region: "Москва", max_price: 45000, min_discount_percent: 20, is_active: true, created_at: new Date().toISOString() },
  { id: "m2", title: "PlayStation 5", query: "PlayStation 5 Slim", region: "Москва", max_price: 35000, min_discount_percent: 15, is_active: true, created_at: new Date().toISOString() },
  { id: "m3", title: "MacBook Air M2", query: "MacBook Air M2", region: "Санкт-Петербург", max_price: 65000, min_discount_percent: 18, is_active: false, created_at: new Date().toISOString() }
];

export const demoListings: Listing[] = [
  { id: "l1", source: "demo", external_id: "demo-001", title: "iPhone 15 Pro 256 GB, отличное состояние", price: 32900, currency: "RUB", region: "Москва", url: "https://www.avito.ru/", image_url: null, discount_percent: 27, published_at: new Date().toISOString(), first_seen_at: new Date().toISOString() },
  { id: "l2", source: "demo", external_id: "demo-002", title: "PlayStation 5 Slim + второй геймпад", price: 28900, currency: "RUB", region: "Москва", url: "https://www.avito.ru/", image_url: null, discount_percent: 18, published_at: new Date().toISOString(), first_seen_at: new Date().toISOString() },
  { id: "l3", source: "demo", external_id: "demo-003", title: "MacBook Air M2 8/256", price: 58900, currency: "RUB", region: "Санкт-Петербург", url: "https://www.avito.ru/", image_url: null, discount_percent: 22, published_at: new Date().toISOString(), first_seen_at: new Date().toISOString() },
  { id: "l4", source: "demo", external_id: "demo-004", title: "iPhone 14 Pro 128 GB", price: 27900, currency: "RUB", region: "Москва", url: "https://www.avito.ru/", image_url: null, discount_percent: 21, published_at: new Date().toISOString(), first_seen_at: new Date().toISOString() }
];
