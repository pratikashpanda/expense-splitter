-- 1. App User
CREATE TABLE app_user (
    id            NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email         VARCHAR2(255) NOT NULL,
    password_hash VARCHAR2(255) NOT NULL,
    name          VARCHAR2(100) NOT NULL,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_app_user_email UNIQUE (email)
);

-- 2. Expense Group
CREATE TABLE expense_group (
    id         NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name       VARCHAR2(100) NOT NULL,
    created_by NUMBER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_expense_group_created_by FOREIGN KEY (created_by) REFERENCES app_user(id)
);

CREATE INDEX idx_expense_group_created_by ON expense_group(created_by);

-- 3. Group Member (group_id and user_id unique together)
CREATE TABLE group_member (
    group_id  NUMBER NOT NULL,
    user_id   NUMBER NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT pk_group_member PRIMARY KEY (group_id, user_id),
    CONSTRAINT fk_group_member_group FOREIGN KEY (group_id) REFERENCES expense_group(id) ON DELETE CASCADE,
    CONSTRAINT fk_group_member_user FOREIGN KEY (user_id) REFERENCES app_user(id) ON DELETE CASCADE
);

CREATE INDEX idx_group_member_user_id ON group_member(user_id);

-- 4. Expense
CREATE TABLE expense (
    id          NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    group_id    NUMBER NOT NULL,
    paid_by     NUMBER NOT NULL,
    description VARCHAR2(255) NOT NULL,
    amount      NUMBER(18, 0) NOT NULL,
    split_type  VARCHAR2(20) NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_expense_amount CHECK (amount > 0),
    CONSTRAINT chk_expense_split_type CHECK (split_type IN ('EQUAL', 'EXACT', 'PERCENT', 'SHARES')),
    CONSTRAINT fk_expense_group FOREIGN KEY (group_id) REFERENCES expense_group(id) ON DELETE CASCADE,
    CONSTRAINT fk_expense_paid_by FOREIGN KEY (paid_by) REFERENCES app_user(id)
);

CREATE INDEX idx_expense_group_id ON expense(group_id);
CREATE INDEX idx_expense_paid_by ON expense(paid_by);

-- 5. Expense Share
CREATE TABLE expense_share (
    expense_id   NUMBER NOT NULL,
    user_id      NUMBER NOT NULL,
    share_amount NUMBER(18, 0) NOT NULL,
    CONSTRAINT pk_expense_share PRIMARY KEY (expense_id, user_id),
    CONSTRAINT chk_expense_share_amount CHECK (share_amount > 0),
    CONSTRAINT fk_expense_share_expense FOREIGN KEY (expense_id) REFERENCES expense(id) ON DELETE CASCADE,
    CONSTRAINT fk_expense_share_user FOREIGN KEY (user_id) REFERENCES app_user(id) ON DELETE CASCADE
);

CREATE INDEX idx_expense_share_user_id ON expense_share(user_id);

-- 6. Settlement
CREATE TABLE settlement (
    id         NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    group_id   NUMBER NOT NULL,
    from_user  NUMBER NOT NULL,
    to_user    NUMBER NOT NULL,
    amount     NUMBER(18, 0) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_settlement_amount CHECK (amount > 0),
    CONSTRAINT chk_settlement_distinct_users CHECK (from_user != to_user),
    CONSTRAINT fk_settlement_group FOREIGN KEY (group_id) REFERENCES expense_group(id) ON DELETE CASCADE,
    CONSTRAINT fk_settlement_from_user FOREIGN KEY (from_user) REFERENCES app_user(id),
    CONSTRAINT fk_settlement_to_user FOREIGN KEY (to_user) REFERENCES app_user(id)
);

CREATE INDEX idx_settlement_group_id ON settlement(group_id);
CREATE INDEX idx_settlement_from_user ON settlement(from_user);
CREATE INDEX idx_settlement_to_user ON settlement(to_user);

