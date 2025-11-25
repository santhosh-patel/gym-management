-- PostgreSQL Trigger Implementation

-- 1. Create the function
CREATE OR REPLACE FUNCTION update_check_ins_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE members
    SET total_check_ins = total_check_ins + 1
    WHERE id = NEW.member_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Create the trigger
CREATE TRIGGER increment_check_ins
AFTER INSERT ON attendance
FOR EACH ROW
EXECUTE FUNCTION update_check_ins_count();
