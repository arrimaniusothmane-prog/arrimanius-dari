# DarEstate Database Architecture

## Overview

Supabase (PostgreSQL) with Row Level Security enabled on all tables.

## Enum Types

```sql
CREATE TYPE user_role AS ENUM ('BUYER', 'SELLER', 'AGENT', 'ADMIN');
CREATE TYPE property_category AS ENUM ('APARTMENT', 'VILLA', 'HOUSE', 'LAND', 'COMMERCIAL');
CREATE TYPE property_status AS ENUM ('DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'PAUSED', 'SOLD', 'REJECTED');
CREATE TYPE lead_status AS ENUM ('NEW', 'CONTACTED', 'VISIT_REQUESTED', 'VISIT_COMPLETED', 'OFFER_MADE', 'NEGOTIATION', 'SOLD', 'CANCELLED');
CREATE TYPE offer_status AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'COUNTER_OFFER');
CREATE TYPE transaction_status AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');
CREATE TYPE commission_status AS ENUM ('PENDING', 'DUE', 'PAID', 'CANCELLED');
```

## Tables

### users

| Column | Type | Notes |
|---|---|---|
| id | uuid PRIMARY KEY | References auth.users |
| name | text NOT NULL | |
| email | text UNIQUE NOT NULL | |
| phone | text | |
| avatar | text | |
| role | user_role NOT NULL DEFAULT 'BUYER' | |
| is_verified | boolean NOT NULL DEFAULT false | |
| company_name | text | Nullable |
| created_at | timestamptz NOT NULL DEFAULT now() | |

### properties

| Column | Type | Notes |
|---|---|---|
| id | uuid PRIMARY KEY DEFAULT gen_random_uuid() | |
| slug | text UNIQUE NOT NULL | |
| title | text NOT NULL | |
| description | text NOT NULL | |
| price | numeric NOT NULL CHECK (price > 0) | |
| category | property_category NOT NULL | |
| status | property_status NOT NULL DEFAULT 'DRAFT' | |
| street | text NOT NULL | |
| city | text NOT NULL | |
| state | text NOT NULL | |
| zip | text NOT NULL | |
| country | text NOT NULL DEFAULT 'Morocco' | |
| latitude | double precision | |
| longitude | double precision | |
| surface | numeric NOT NULL CHECK (surface > 0) | |
| bedrooms | integer NOT NULL DEFAULT 0 | |
| bathrooms | integer NOT NULL DEFAULT 0 | |
| floors | integer NOT NULL DEFAULT 0 | |
| year_built | integer | Nullable |
| amenities | text[] NOT NULL DEFAULT '{}' | |
| features | text[] NOT NULL DEFAULT '{}' | |
| is_verified | boolean NOT NULL DEFAULT false | |
| is_furnished | boolean NOT NULL DEFAULT false | |
| has_parking | boolean NOT NULL DEFAULT false | |
| has_pool | boolean NOT NULL DEFAULT false | |
| has_garden | boolean NOT NULL DEFAULT false | |
| has_terrace | boolean NOT NULL DEFAULT false | |
| is_new_construction | boolean NOT NULL DEFAULT false | |
| views | integer NOT NULL DEFAULT 0 | |
| favorite_count | integer NOT NULL DEFAULT 0 | |
| seller_id | uuid NOT NULL REFERENCES users(id) | |
| created_at | timestamptz NOT NULL DEFAULT now() | |
| updated_at | timestamptz NOT NULL DEFAULT now() | |

### property_images

| Column | Type | Notes |
|---|---|---|
| id | uuid PRIMARY KEY DEFAULT gen_random_uuid() | |
| property_id | uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE | |
| url | text NOT NULL | |
| alt | text NOT NULL | |
| is_primary | boolean NOT NULL DEFAULT false | |
| order | integer NOT NULL DEFAULT 0 | |
| created_at | timestamptz NOT NULL DEFAULT now() | |

### favorites

| Column | Type | Notes |
|---|---|---|
| id | uuid PRIMARY KEY DEFAULT gen_random_uuid() | |
| user_id | uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE | |
| property_id | uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE | |
| created_at | timestamptz NOT NULL DEFAULT now() | |
| | UNIQUE(user_id, property_id) | |

### leads

| Column | Type | Notes |
|---|---|---|
| id | uuid PRIMARY KEY DEFAULT gen_random_uuid() | |
| property_id | uuid NOT NULL REFERENCES properties(id) | |
| buyer_id | uuid NOT NULL REFERENCES users(id) | |
| seller_id | uuid NOT NULL REFERENCES users(id) | |
| status | lead_status NOT NULL DEFAULT 'NEW' | |
| message | text | |
| name | text NOT NULL | |
| phone | text | |
| email | text | |
| created_at | timestamptz NOT NULL DEFAULT now() | |
| updated_at | timestamptz NOT NULL DEFAULT now() | |

### visits

| Column | Type | Notes |
|---|---|---|
| id | uuid PRIMARY KEY DEFAULT gen_random_uuid() | |
| property_id | uuid NOT NULL REFERENCES properties(id) | |
| lead_id | uuid NOT NULL REFERENCES leads(id) | |
| date | date NOT NULL | |
| time | time NOT NULL | |
| number_of_visitors | integer NOT NULL DEFAULT 1 | |
| phone | text | |
| message | text | |
| status | lead_status NOT NULL DEFAULT 'VISIT_REQUESTED' | |
| created_at | timestamptz NOT NULL DEFAULT now() | |

### offers

| Column | Type | Notes |
|---|---|---|
| id | uuid PRIMARY KEY DEFAULT gen_random_uuid() | |
| property_id | uuid NOT NULL REFERENCES properties(id) | |
| buyer_id | uuid NOT NULL REFERENCES users(id) | |
| price | numeric NOT NULL CHECK (price > 0) | |
| message | text | |
| preferred_contact | text | |
| status | offer_status NOT NULL DEFAULT 'PENDING' | |
| created_at | timestamptz NOT NULL DEFAULT now() | |
| updated_at | timestamptz NOT NULL DEFAULT now() | |

### transactions

| Column | Type | Notes |
|---|---|---|
| id | uuid PRIMARY KEY DEFAULT gen_random_uuid() | |
| property_id | uuid NOT NULL REFERENCES properties(id) | |
| seller_id | uuid NOT NULL REFERENCES users(id) | |
| buyer_id | uuid NOT NULL REFERENCES users(id) | |
| sale_price | numeric NOT NULL | |
| commission_percentage | numeric NOT NULL | |
| commission_amount | numeric NOT NULL | |
| status | transaction_status NOT NULL DEFAULT 'PENDING' | |
| created_at | timestamptz NOT NULL DEFAULT now() | |

### commissions

| Column | Type | Notes |
|---|---|---|
| id | uuid PRIMARY KEY DEFAULT gen_random_uuid() | |
| transaction_id | uuid NOT NULL REFERENCES transactions(id) | |
| amount | numeric NOT NULL | |
| percentage | numeric NOT NULL | |
| status | commission_status NOT NULL DEFAULT 'PENDING' | |
| due_date | date NOT NULL | |
| paid_date | date | Nullable |
| created_at | timestamptz NOT NULL DEFAULT now() | |

### messages

| Column | Type | Notes |
|---|---|---|
| id | uuid PRIMARY KEY DEFAULT gen_random_uuid() | |
| sender_id | uuid NOT NULL REFERENCES users(id) | |
| receiver_id | uuid NOT NULL REFERENCES users(id) | |
| property_id | uuid NOT NULL REFERENCES properties(id) | |
| content | text NOT NULL | |
| is_read | boolean NOT NULL DEFAULT false | |
| created_at | timestamptz NOT NULL DEFAULT now() | |

### notifications

| Column | Type | Notes |
|---|---|---|
| id | uuid PRIMARY KEY DEFAULT gen_random_uuid() | |
| user_id | uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE | |
| title | text NOT NULL | |
| message | text NOT NULL | |
| type | text NOT NULL | |
| is_read | boolean NOT NULL DEFAULT false | |
| created_at | timestamptz NOT NULL DEFAULT now() | |

### reviews

| Column | Type | Notes |
|---|---|---|
| id | uuid PRIMARY KEY DEFAULT gen_random_uuid() | |
| reviewer_id | uuid NOT NULL REFERENCES users(id) | |
| reviewed_id | uuid NOT NULL REFERENCES users(id) | |
| rating | integer NOT NULL CHECK (rating >= 1 AND rating <= 5) | |
| comment | text | |
| created_at | timestamptz NOT NULL DEFAULT now() | |

## Indexes

```sql
CREATE INDEX idx_properties_slug ON properties(slug);
CREATE INDEX idx_properties_category ON properties(category);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_seller_id ON properties(seller_id);
CREATE INDEX idx_properties_created_at ON properties(created_at DESC);
CREATE INDEX idx_property_images_property_id ON property_images(property_id);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_property_id ON favorites(property_id);
CREATE INDEX idx_leads_property_id ON leads(property_id);
CREATE INDEX idx_leads_seller_id ON leads(seller_id);
CREATE INDEX idx_leads_buyer_id ON leads(buyer_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_visits_property_id ON visits(property_id);
CREATE INDEX idx_visits_lead_id ON visits(lead_id);
CREATE INDEX idx_offers_property_id ON offers(property_id);
CREATE INDEX idx_offers_buyer_id ON offers(buyer_id);
CREATE INDEX idx_offers_status ON offers(status);
CREATE INDEX idx_transactions_property_id ON transactions(property_id);
CREATE INDEX idx_transactions_seller_id ON transactions(seller_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_commissions_transaction_id ON commissions(transaction_id);
CREATE INDEX idx_commissions_status ON commissions(status);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_reviews_reviewed_id ON reviews(reviewed_id);
```

## Relationships

```
users 1──N properties        (seller_id)
users 1──N leads             (buyer_id, seller_id)
users 1──N favorites         (user_id)
users 1──N messages          (sender_id, receiver_id)
users 1──N notifications     (user_id)
users 1──N reviews           (reviewer_id, reviewed_id)

properties 1──N property_images
properties 1──N favorites
properties 1──N leads
properties 1──N visits
properties 1──N offers
properties 1──N transactions

leads 1──N visits
transactions 1──N commissions
```

## Row Level Security (RLS)

| Table | Policy | Rule |
|---|---|---|
| users | Select | Public read; users can update own profile |
| properties | Select | Published properties public; sellers manage own |
| properties | Insert/Update/Delete | Only authenticated seller/agent/admin |
| property_images | All | Tied to parent property permissions |
| favorites | Select/Insert/Delete | Users manage own favorites only |
| leads | Select | Seller sees own leads; buyer sees own leads |
| leads | Insert | Authenticated users can create leads |
| visits | Select | Linked lead participants only |
| visits | Insert | Authenticated users can request visits |
| offers | Select | Buyer and seller of the offer only |
| offers | Insert | Authenticated buyers only |
| transactions | Select | Buyer, seller, or admin only |
| commissions | Select | Admin and linked seller only |
| messages | Select | Sender or receiver only |
| messages | Insert | Authenticated; sender must be current user |
| notifications | Select/Update | Owner only |
| reviews | Select | Public read; authenticated write |

Enable RLS on every table:

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
```
