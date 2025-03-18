-- Example function to update likes count on video
CREATE OR REPLACE FUNCTION update_video_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE videos
  SET likes = (SELECT COUNT(*) FROM likes WHERE video_id = NEW.video_id)
  WHERE id = NEW.video_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call update_video_likes_count() when a like is added
CREATE TRIGGER on_like_insert
AFTER INSERT ON likes
FOR EACH ROW
EXECUTE PROCEDURE update_video_likes_count();

-- Trigger to call update_video_likes_count() when a like is removed
CREATE TRIGGER on_like_delete
AFTER DELETE ON likes
FOR EACH ROW
EXECUTE PROCEDURE update_video_likes_count();