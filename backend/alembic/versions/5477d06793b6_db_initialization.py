"""db initialization

Revision ID: 5477d06793b6
Revises: 
Create Date: 2024-10-26 23:26:28.528769

"""
from typing import Sequence, Union

from alembic import op
import geoalchemy2
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '5477d06793b6'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('kingdoms',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('sites',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('lat', sa.Float(), nullable=False),
    sa.Column('lon', sa.Float(), nullable=False),
    sa.Column('geom', geoalchemy2.types.Geometry(geometry_type='POINT', from_text='ST_GeomFromEWKT', name='geometry', nullable=False), nullable=False),
    sa.Column('country', sa.String(), nullable=True),
    sa.Column('region', sa.String(), nullable=True),
    sa.Column('continent', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('taxons',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('fullname', sa.String(), nullable=True),
    sa.Column('hashed_password', sa.String(), nullable=False),
    sa.Column('is_active', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('username')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_table('plant_species',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('scientific_name', sa.String(), nullable=True),
    sa.Column('kingdom_id', sa.Integer(), nullable=True),
    sa.Column('taxon_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['kingdom_id'], ['kingdoms.id'], ),
    sa.ForeignKeyConstraint(['taxon_id'], ['taxons.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('observations',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('site_id', sa.Integer(), nullable=False),
    sa.Column('plant_specie_id', sa.Integer(), nullable=False),
    sa.Column('source', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['plant_specie_id'], ['plant_species.id'], ),
    sa.ForeignKeyConstraint(['site_id'], ['sites.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('observations')
    op.drop_table('plant_species')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
    op.drop_table('taxons')
    op.drop_table('sites')
    op.drop_table('kingdoms')
    # ### end Alembic commands ###
