DEFINE NAMESPACE FanaPen;
DEFINE DATABASE one;

USE NS FanaPen DB one;

DEFINE TABLE user SCHEMAFULL;
DEFINE FIELD username ON TABLE user TYPE string;
DEFINE FIELD passwordHash ON TABLE user TYPE string;
DEFINE FIELD createdAt ON TABLE user TYPE datetime;
DEFINE INDEX user_username_unique ON TABLE user COLUMNS username UNIQUE;

DEFINE TABLE session SCHEMAFULL;
DEFINE FIELD userId ON TABLE session TYPE string;
DEFINE FIELD expiresAt ON TABLE session TYPE datetime;
DEFINE INDEX session_userId ON TABLE session COLUMNS userId;
DEFINE INDEX session_expiresAt ON TABLE session COLUMNS expiresAt;

DEFINE TABLE project SCHEMAFULL;
DEFINE FIELD userId ON TABLE project TYPE string;
DEFINE FIELD name ON TABLE project TYPE string;
DEFINE FIELD slug ON TABLE project TYPE string;
DEFINE FIELD files ON TABLE project TYPE object;
DEFINE FIELD files.html ON TABLE project TYPE string;
DEFINE FIELD files.css ON TABLE project TYPE string;
DEFINE FIELD files.js ON TABLE project TYPE string;
DEFINE FIELD isDeployed ON TABLE project TYPE bool;
DEFINE FIELD views ON TABLE project TYPE number;
DEFINE FIELD createdAt ON TABLE project TYPE datetime;
DEFINE FIELD updatedAt ON TABLE project TYPE datetime;
DEFINE INDEX project_userId ON TABLE project COLUMNS userId;
DEFINE INDEX project_slug_by_user ON TABLE project COLUMNS userId, slug UNIQUE;
DEFINE INDEX project_user_updated ON TABLE project COLUMNS userId, updatedAt;
DEFINE INDEX project_deployed_slug ON TABLE project COLUMNS userId, slug, isDeployed;
DEFINE INDEX project_deployed_views ON TABLE project COLUMNS isDeployed, views;
