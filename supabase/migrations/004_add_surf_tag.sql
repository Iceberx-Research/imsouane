-- Add 'surf' to the allowed tag values on posts
alter table posts drop constraint posts_tag_check;
alter table posts add constraint posts_tag_check
  check (tag in ('question','for_sale','lost_found','event','general','service','surf'));
