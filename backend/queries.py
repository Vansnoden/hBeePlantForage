QUERY_TOP_10_MOST_REPORTED_PLANTS = """
    select count(o.id), o.plant_specie_id , ps.name as plant_name
    from observations as o
    inner join plant_species as ps on o.plant_specie_id = ps.id
    group by o.plant_specie_id, ps.name order by count desc limit 10
"""

QUERY_OBS_YEARLY_OVERVIEW = """
    select count(id), year from observations where year between {year_start} and {year_end} group by year order by year asc
"""

QUERY_MONTHLY_OBS_DISTRO = """
select count(id), month from observations where month notnull group by month order by month asc
"""

QUERY_PLANT_SUMMARY_DATA = """
    select o.id, s.name as site_name, s.country, ps.name as plant_name, 
    ps.scientific_name, f.name as family, t.name as taxon, k.name 
    as kingdom from observations as o
    inner join plant_species as ps on o.plant_specie_id = ps.id 
    inner join sites as s on o.site_id = s.id
    left  join "family"as f on ps.family_id = f.id
    left  join kingdoms as k on ps.kingdom_id = k.id
    left  join taxons as t on ps.taxon_id = t.id
    limit {items_per_page} offset {offset}
    """

QUERY_COUNT_PLANT_SUMMARY_DATA = """
    select count(*) from (
        select o.id, s.name as site_name, s.country, ps.name as plant_name, 
        ps.scientific_name, f.name as family, t.name as taxon, k.name 
        as kingdom from observations as o
        inner join plant_species as ps on o.plant_specie_id = ps.id 
        inner join sites as s on o.site_id = s.id
        left  join "family"as f on ps.family_id = f.id
        left  join kingdoms as k on ps.kingdom_id = k.id
        left  join taxons as t on ps.taxon_id = t.id
        limit {limit})
    """

QUERY_PLANT_SUMMARY_DATA_FILTERED = """
    select o.id, s.name as site_name, s.country, ps.name as plant_name, 
        ps.scientific_name, f.name as family, t.name as taxon, k.name 
        as kingdom from observations as o
        inner join plant_species as ps on o.plant_specie_id = ps.id 
        inner join sites as s on o.site_id = s.id
        left  join "family"as f on ps.family_id = f.id
        left  join kingdoms as k on ps.kingdom_id = k.id
        left  join taxons as t on ps.taxon_id = t.id
        where s.name ilike '{query}' or s.country ilike '{query}' 
            or ps.name ilike '{query}' or f.name ilike '{query}' 
            or k.name ilike '{query}' or t.name ilike '{query}'
        limit {items_per_page} offset {offset}
"""


QUERY_COUNT_PLANT_SUMMARY_DATA_FILTERED = """
    select count(*) from (
        select o.id, s.name as site_name, s.country, ps.name as plant_name, 
        ps.scientific_name, f.name as family, t.name as taxon, k.name 
        as kingdom from observations as o
        inner join plant_species as ps on o.plant_specie_id = ps.id 
        inner join sites as s on o.site_id = s.id
        left  join "family"as f on ps.family_id = f.id
        left  join kingdoms as k on ps.kingdom_id = k.id
        left  join taxons as t on ps.taxon_id = t.id
        where s.name ilike '{query}' or s.country ilike '{query}' 
            or ps.name ilike '{query}' or f.name ilike '{query}' 
            or k.name ilike '{query}' or t.name ilike '{query}'
        limit {limit})
"""

