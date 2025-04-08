library(tidyverse)
library(ggplot2)


beeplant = read.csv("./data/bee_data_ok_all_continent.csv", sep = ",",header = T)
list_plantSpecies = read.csv("./data/All_beePlantSpecies_withFamilly.csv", sep = ";",header = T)

names(list_plantSpecies)<- c("orig_Family","orig_Species")


beeplant <- beeplant %>% mutate(continent = as.factor(continent), region = as.factor(region),country = as.factor(country),family_name = as.factor(family_name),plant_specie_name = as.factor(plant_specie_name), isNative  = as.factor(isNative ))
summary(beeplant)

list_plantSpecies <- list_plantSpecies %>% mutate(orig_Family = as.factor(orig_Family), orig_Species = as.factor(orig_Species))
summary(list_plantSpecies)



beeplant$continent = factor(beeplant$continent,
                            levels = c( "AFRICA","ASIA", "Africa","Americas", "Asia" , "EUROPE", "Europe", "NORTH_AMERICA", "OCEANIA", "Oceania", "SOUTH_AMERICA"),
                            labels = c( "AFRICA","ASIA", "AFRICA","Americas", "ASIA" , "EUROPE", "EUROPE", "NORTH_AMERICA", "OCEANIA", "OCEANIA", "SOUTH_AMERICA") )

levels(beeplant$region)[levels(beeplant$region)=="Middle Africa"] <- "Central Africa"
names(beeplant)[11] = "isNative"
levels(beeplant$isNative) = c("NO", "YES")

beeplant <- beeplant %>% filter(!is.na(lon) & !is.na(lat))




##################  Cleaning process of the plant species names ################

#Deleting wrong plant species name (species with family name of one word)
beeplant <- beeplant %>%
  mutate(nbWord_plantspecieName = lengths(str_split(as.character(beeplant$plant_specie_name), " ")))

beeplant <- beeplant %>% filter(nbWord_plantspecieName > 1) # Delete all name with one work

 correctPlantSpecName = rep(NA,dim(beeplant)[1])
# gdName = which(beeplant$nbWord_plantspecieName == 2)
# correctPlantSpecName[gdName] = beeplant$plant_specie_name[gdName]

 
 beeplant_cp  =beeplant

listId_wrongPlant = which(beeplant$nbWord_plantspecieName > 2)  #We extract only the two first word of for species wit mor thant two name
for (indc in 1:dim(beeplant)[1]) {
 # beeplant[indc,"plant_specie_name"] = paste0(unlist(strsplit(as.character(beeplant$plant_specie_name[indc])," "))[1:2],collapse = " ")
  correctPlantSpecName[indc] = paste0(unlist(strsplit(as.character(beeplant$plant_specie_name[indc])," "))[1:2],collapse = " ")
}


nolistId_wrongPlant = which(beeplant$nbWord_plantspecieName <= 2)
for (indc in nolistId_wrongPlant) 
  {
   correctPlantSpecName[indc] = beeplant[indc,"plant_specie_name"]
  #  paste0(unlist(strsplit(as.character(beeplant$plant_specie_name[indc])," "))[1:2],collapse = " ")
  # correctPlantSpecName[indc] = paste0(unlist(strsplit(as.character(beeplant$plant_specie_name[indc])," "))[1:2],collapse = " ")
}

beeplant$plant_specie_name <- correctPlantSpecName
beeplant_cp  =beeplant

## now we delete species name not in our original initial list
beeplant= beeplant[beeplant$plant_specie_name %in% list_plantSpecies$orig_Species,]

#savint cleaned data
#write.csv(beeplant, "./data/allCleanned_BeePlantSpeciesData.csv", sep = ",", row.names = FALSE)
beeplant = read.csv("./data/allCleanned_BeePlantSpeciesData.csv ", sep = ",",header = T)


beeplant <- beeplant %>% mutate(continent = as.factor(continent), region = as.factor(region),country = as.factor(country),
                                family_name = as.factor(family_name),plant_specie_name = as.factor(plant_specie_name),
                                correctPlantSpecName = as.factor(correctPlantSpecName), isNative = as.factor(isNative),, correctPlantSpecName = as.factor(correctPlantSpecName))


beeplant$continent = factor(beeplant$continent,
                            levels = c("AFRICA","ASIA","Americas","EUROPE","NORTH_AMERICA","OCEANIA","SOUTH_AMERICA"),
                            labels = c("AFRICA", "ASIA" , "Americas", "EUROPE","Americas","OCEANIA","Americas" ))



######################
###################### Geocoding: here we assign the missing country name and continent
listIdNocontinent = which(is.na(beeplant$continent))
noContinent <- beeplant %>% filter(is.na(beeplant$continent))

noContinent = data.frame(initIdx = listIdNocontinent,noContinent )


library(sp)
library(rworldmap)
library(OSMscale)


# The single argument to this function, points, is a data.frame in which:
#   - column 1 contains the longitude in degrees
#   - column 2 contains the latitude in degrees
coords2continent = function(pts)
{  
  countriesSP <- getMap(resolution='low')
  #countriesSP <- getMap(resolution='high') #you could use high res map from rworldxtra if you were concerned about detail
  
  # converting points to a SpatialPoints object
  # setting CRS directly to that from rworldmap
  pointsSP = SpatialPoints(pts, proj4string=CRS(proj4string(countriesSP)))  
  
  
  # use 'over' to get indices of the Polygons object containing each point 
  indices = over(pointsSP, countriesSP)
  
  #indices$continent   # returns the continent (6 continent model)
  indices$REGION   # returns the continent (7 continent model)
  indices$ADMIN  #returns country name
  #indices$ISO3 # returns the ISO3 code 
  
  res = data.frame(RCountry = indices$ADMIN , RContinent = indices$REGION )
  
  return(res)
}



pts= noContinent[,c("lon","lat")]
pts$lon = as.integer(pts$lon)
pts$lat = as.integer(pts$lat)
rCont = coords2continent(pts)   # result for missing continent

noContinent = data.frame(noContinent,rCont)

noContinent$RContinent = as.character(noContinent$RContinent)
noContinent$RCountry = as.character(noContinent$RCountry)

beeplant$continent = as.character(beeplant$continent)
beeplant$country = as.character(beeplant$country)

## Updating the beepolant data

for (indc in 1:dim(noContinent)[1]) 
{
  print(indc)
  i = noContinent$initIdx[indc]
  beeplant[i,"country"] = noContinent$RCountry[indc]
  beeplant[i,"continent"] = noContinent$RContinent[indc]
}



 write.csv(beeplant, "./data/allCleanned_BeePlantSpeciesData_finalCleanned.csv", sep = ",", row.names = FALSE)  # Saving the new updatre file


############################### Part 3: 
### 
 beeplant_cp  =beeplant  # here you can read the saved dataset in part 2
 
 beeplant <- beeplant %>% filter( !is.na(continent))
 
# now we have to assign the correct region for proper mapping
 noRegion <- beeplant %>% filter(is.na(region))

 
 
 easternAfrika = distinct(beeplant %>% select(continent,country,region) %>% filter(region == "Eastern Africa"))
 
 CentralAfrica =  distinct(beeplant %>% select(continent,country,region) %>% filter(region == "Central Africa"))
 
 distinct(beeplant %>% select(continent,country,region) %>% filter(country == "France"))
 
 
 
 ########### end cleaning processs ###########


#####################################    #####################################   #####################################
  ##################################### 
###### Ploting and visualisation ##############
 # Uploading  the final dataset 
 
 beeplant = read.csv("./data/allCleanned_BeePlantSpeciesData_finalCleanned_v3_cleaned.csv", sep = ";",header = T)
 
 
 
 beeplant <- beeplant %>% mutate(family_name = as.factor(family_name),Fcontinent = as.factor(Fcontinent), year=as.integer(year), FRegion = as.factor(FRegion),FCountry = as.factor(FCountry),
                                 correctPlantSpecName  = as.factor(correctPlantSpecName),plant_specie_name = as.factor(plant_specie_name), 
                                 lat=as.integer(lat),lon=as.integer(lon),isNative  = as.factor(isNative ))
 summary(beeplant)
 
# 
# beeplant %>%
#    select(year, month,lat,lon, isNative,family_name, correctPlantSpecName,Fcontinent, FRegion,FCountry) %>%
#    rename( plant_specie_name = correctPlantSpecName )%>%
#    filter(Fcontinent=="Africa"& family_name == "Aizoaceae")%>%
#    write.csv2("./data/Aizoaceae_Africa_plantSpeciesData.csv", sep = ",", row.names = FALSE)  # Saving the new updatre file

   
#Asteraceae , Fabaceae , Proteaceae ,  Asphodelaceae, Aizoaceae 
 
 
 levels(beeplant$FRegion)[levels(beeplant$FRegion)=="Middle Africa"] <- "Central Africa"
 
 #beeplant <- beeplant %>% filter(!is.na(lon) & !is.na(lat))
 
 
 
# '''''''' PLOT 1- Tree maps
# treemap
library(treemap)
Bp_perReg_Cont <- beeplant %>% 
  count(Fcontinent,FRegion,family_name)
names(Bp_perReg_Cont)[4] = "NberPlantOccurence"


treemap(Bp_perReg_Cont[108:nrow(Bp_perReg_Cont),],
        index=c("Fcontinent","FRegion"),
        vSize="NberPlantOccurence",
        type="index"
)


# '''''''' PLOT 2  - bar plot

library(viridis)
library(hrbrthemes)
library(ggstats)

Bee_FamCont <- beeplant %>% count(Fcontinent,FRegion,family_name,isNative)
names(Bee_FamCont)[5] = "NberPlantOccurence"



# Grouped
Bee_FamCont %>% 
  mutate(family_name = fct_reorder(family_name,-NberPlantOccurence))%>% #  , 
  ggplot( ) + 
  geom_bar(aes(x=reorder(family_name,-NberPlantOccurence),fill=isNative, y=NberPlantOccurence),position="stack", stat="identity",width = 0.8)+
  coord_flip()+
 # scale_fill_viridis(discrete = T, option = "E") +
  ggtitle("Bee Plant familly") +
  scale_y_continuous(labels=c("0", "10000", "20000", "30000", "40000"))+
#  theme(axis.text.x = element_text(face = 'bold'))+
  theme_classic()+
  theme(axis.text.y =  element_text(face="bold", size = 8))+
  theme(axis.text.x = element_text(face="bold", size = 9))+
  scale_y_continuous(labels=c("0", "10000", "20000", "30000", "40000"))+
  #  geom_col(just = 0.5)+
#  theme() +
  xlab("Plant Families")+
  ylab("Number of occurence")
#  geom_text(stat = "prop", position = position_fill(.5))

#  facet_wrap(~Fcontinent)



Bee_FamCont %>% mutate(percenOccur = Bee_FamCont$NberPlantOccurence/sum(Bee_FamCont$NberPlantOccurence)*100) %>% 
  ggplot()+
  geom_bar(aes(x=isNative,fill=isNative, y=percenOccur), stat="identity",width = 0.5)+
  theme_classic()+
  theme(axis.text.y =  element_text(face="bold", size = 8))+
  theme(axis.text.x = element_text(face="bold", size = 9))+
#  geom_text(aes(label = scales::percent()), stat = "identity",position = position_stack(.5))+
  #  scale_y_percent(labels = scales::percent)+
#  ylim(c(0,100))+
  xlab("Native Species")+
  ylab("Percentage")



## Aceptable
ggplot(Bee_FamCont) +
     aes(x = reorder(isNative,-NberPlantOccurence), fill = isNative, weight = NberPlantOccurence) +
     geom_bar(stat = "prop",width = 0.4) +
     geom_text(aes(label = scales::percent(after_stat(prop))), stat = "prop",position = position_stack(.5))+
      theme_classic()+
     theme(axis.text.y =  element_text(face="bold", size = 0))+
     theme(axis.text.x = element_text(face="bold", size = 9))+
   #  scale_y_percent(labels = scales::percent)+
  coord_flip()+
    xlab("Native")+
     ylab("")



######################
################ sunsburt graph  : useful link: https://rpubs.com/DragonflyStats/Sunburst-Plots-With-Plotly
library(data.table)
library(dplyr)
library(plotly)

#This function turns a data frame into a hierarchical data structure.

as.sunburstDF <- function(DF, value_column = NULL, add_root = FALSE){
  require(data.table)
  
  colNamesDF <- names(DF)
  
  if(is.data.table(DF)){
    DT <- copy(DF)
  } else {
    DT <- data.table(DF, stringsAsFactors = FALSE)
  }
  
  if(add_root){
    DT[, root := "Total"]  
  }
  
  colNamesDT <- names(DT)
  hierarchy_columns <- setdiff(colNamesDT, value_column)
  DT[, (hierarchy_columns) := lapply(.SD, as.factor), .SDcols = hierarchy_columns]
  
  if(is.null(value_column) && add_root){
    setcolorder(DT, c("root", colNamesDF))
  } else if(!is.null(value_column) && !add_root) {
    setnames(DT, value_column, "values", skip_absent=TRUE)
    setcolorder(DT, c(setdiff(colNamesDF, value_column), "values"))
  } else if(!is.null(value_column) && add_root) {
    setnames(DT, value_column, "values", skip_absent=TRUE)
    setcolorder(DT, c("root", setdiff(colNamesDF, value_column), "values"))
  }
  
  hierarchyList <- list()
  
  for(i in seq_along(hierarchy_columns)){
    current_columns <- colNamesDT[1:i]
    if(is.null(value_column)){
      currentDT <- unique(DT[, ..current_columns][, values := .N, by = current_columns], by = current_columns)
    } else {
      currentDT <- DT[, lapply(.SD, sum, na.rm = TRUE), by=current_columns, .SDcols = "values"]
    }
    setnames(currentDT, length(current_columns), "labels")
    hierarchyList[[i]] <- currentDT
  }
  
  hierarchyDT <- rbindlist(hierarchyList, use.names = TRUE, fill = TRUE)
  
  parent_columns <- setdiff(names(hierarchyDT), c("labels", "values", value_column))
  hierarchyDT[, parents := apply(.SD, 1, function(x){fifelse(all(is.na(x)), yes = NA_character_, no = paste(x[!is.na(x)], sep = ":", collapse = " - "))}), .SDcols = parent_columns]
  hierarchyDT[, ids := apply(.SD, 1, function(x){paste(x[!is.na(x)], collapse = " - ")}), .SDcols = c("parents", "labels")]
  hierarchyDT[, c(parent_columns) := NULL]
  return(hierarchyDT)
}


##Sunburst Dataframe
Bee_SunsburtGraph <- beeplant %>% count(Fcontinent,FRegion,family_name)
names(Bee_SunsburtGraph)[4] = "NberPlantOccurence"

## Global Grpah
sunburstDF <- as.sunburstDF(Bee_SunsburtGraph, value_column = "NberPlantOccurence", add_root = TRUE)
head(sunburstDF)
levels(sunburstDF$labels)[levels(sunburstDF$labels)=="Total"] <- "CONTINENT"
plot_ly(data = sunburstDF, ids = ~ids, labels= ~labels, parents = ~parents, values= ~values, type='sunburst', branchvalues = 'total')

## Africa subregion
sunburstDF <- Bee_SunsburtGraph %>% filter(Fcontinent == "Africa") %>%
  as.sunburstDF( value_column = "NberPlantOccurence", add_root = FALSE)
#head(sunburstDF)
levels(sunburstDF$labels)[levels(sunburstDF$labels)=="Total"] <- "AFRICA"
plot_ly(data = sunburstDF, ids = ~ids, labels= ~labels, parents = ~parents, values= ~values, type='sunburst', branchvalues = 'total')


## Americas sub-region
sunburstDF <- Bee_SunsburtGraph %>% filter(Fcontinent == "Americas") %>%
  as.sunburstDF( value_column = "NberPlantOccurence", add_root = FALSE)
#head(sunburstDF)
levels(sunburstDF$labels)[levels(sunburstDF$labels)=="Total"] <- "AMERICAS"
plot_ly(data = sunburstDF, ids = ~ids, labels= ~labels, parents = ~parents, values= ~values, type='sunburst', branchvalues = 'total')


## Europe sub-region
sunburstDF <- Bee_SunsburtGraph %>% filter(Fcontinent == "Europe") %>%
  as.sunburstDF( value_column = "NberPlantOccurence", add_root = FALSE)
#head(sunburstDF)
levels(sunburstDF$labels)[levels(sunburstDF$labels)=="Total"] <- "EUROPE"
plot_ly(data = sunburstDF, ids = ~ids, labels= ~labels, parents = ~parents, values= ~values, type='sunburst', branchvalues = 'total')



## Asia sub-region
sunburstDF <- Bee_SunsburtGraph %>% filter(Fcontinent == "Asia") %>%
  as.sunburstDF( value_column = "NberPlantOccurence", add_root = FALSE)
#head(sunburstDF)
levels(sunburstDF$labels)[levels(sunburstDF$labels)=="Total"] <- "ASIA"
plot_ly(data = sunburstDF, ids = ~ids, labels= ~labels, parents = ~parents, values= ~values, type='sunburst', branchvalues = 'total')




#########
########### FAMILLY HEATMAP #############

AfkDat <- beeplant %>%
  select(year, month,lat,lon, isNative,family_name, correctPlantSpecName,Fcontinent, FRegion,FCountry) %>%
  rename( plant_specie_name = correctPlantSpecName )%>%
  filter(Fcontinent=="Africa")


AfkDat <- AfkDat %>% 
  mutate(family_name = as.character(family_name),plant_specie_name = as.character(plant_specie_name),FRegion = as.character(FRegion))

AllfamilyMatrix = table(AfkDat$family_name,AfkDat$FRegion,exclude = NA)
colnames(AllfamilyMatrix) <- c("East",  "Central",  "North", "South", "West")


library(pheatmap)  # this is the adopted package for plotting HEATMAP
pheatmap(as.matrix(AllfamilyMatrix), cluster_rows = F, cluster_cols = F, fontsize_number = 15,angle_col=45,fontsize_row=10,cellheight = 10,filename ="./data/AFkfamily_heatMap.tiff" )





# ############### End ploting and viusalisation  ###########




###################### Test #####################



## sunsburst test 
#Case 1: using package highcharter
install.packages("highcharter",dependencies = T)
library(highcharter)

dout1 <- data_to_hierarchical(Bp_perReg_Cont, c(continent, region), NberPlantOccurence)

hchart(dout1, type = "sunburst")



#Case 2: using package plotly
library(plotly)
fig <-plot_ly(
  labels = c("Eve", "Cain", "Seth", "Enos", "Noam", "Abel", "Awan", "Enoch", "Azura"),
  parents = c("", "Eve", "Eve", "Seth", "Seth", "Eve", "Eve", "Awan", "Eve"),
  values = c(65, 14, 12, 10, 2, 6, 6, 4, 4),
  type = 'sunburst',
  branchvalues = 'total'
)

fig


#####################
  


beeplant %>% select(continent,plant_specie_name,family_name)%>%
  count(family_name)


beeplant %>% table(family_name)

table(beeplant$family_name, beeplant$continent)


levels(beeplant$continent)

unique(beeplant$year)  %>% sort()


beeplant %>%
  ggplot(aes(y = fct_infreq(family_name))) + 
  geom_bar()
  

beeplant %>% 
  count(family_name)%>%
  rename(nberOcuren = n)%>%
  mutate(family_name = fct_reorder(family_name,-nberOcuren))%>%
  ggplot(aes(x=as.factor(family_name), y= nberOcuren))+
  geom_bar(stat = "identity")+
  coord_flip()
#  coord_polar(start = 0)



beeplant %>% 
  count(family_name,isNative)%>%
  rename(nberOcuren = n)%>%
  mutate(family_name = fct_reorder(family_name,-nberOcuren))%>%
  ggplot(aes(x=as.factor(family_name), y= nberOcuren))+
  geom_bar(stat = "identity")+
  coord_flip()



beeplant %>%
  mutate(family_name = fct_lump(family_name, n = 10000)) %>%
  ggplot(aes(y = fct_infreq(family_name))) + 
  geom_bar()


beeplant[head(which(is.na(beeplant$continent)|beeplant$continent==" "),15),]

beeplant[head(which(beeplant$region==""),15),]


library(ggmap)

### Desert data

DesertBeeplant = read.csv("./data/DesertAfrik_PlantList.csv", sep = ";",header = T)


DesertBeeplant <- DesertBeeplant %>% mutate(family_name = as.factor(family_name),Fcontinent = as.factor(Fcontinent), year=as.integer(year), FRegion = as.factor(FRegion),FCountry = as.factor(FCountry),
                                correctPlantSpecName  = as.factor(correctPlantSpecName),plant_specie_name = as.factor(plant_specie_name), 
                                lat=as.integer(lat),lon=as.integer(lon),isNative  = as.factor(isNative ), Desert = as.factor(Desert ))

levels(DesertBeeplant$FRegion)[levels(DesertBeeplant$FRegion)=="Middle Africa"] <- "Central Africa"

Bee_FamCont <- DesertBeeplant %>% count(Fcontinent,FRegion,family_name,Desert)
names(Bee_FamCont)[5] = "NberPlantOccurence"

#write.csv(Bee_FamCont, "./data/DesertPlant_FamilyPerRegion.csv", sep = ",", row.names = FALSE)


Bee_FamCont %>% 
  mutate(family_name = fct_reorder(family_name,-NberPlantOccurence))%>% #  , 
  ggplot( ) + 
  geom_bar(aes(x=reorder(family_name,-NberPlantOccurence),fill=Desert, y=NberPlantOccurence),position="stack", stat="identity",width = 0.8)+
  coord_flip()+
  # scale_fill_viridis(discrete = T, option = "E") +
  ggtitle("Bee Plant familly") +
  #  scale_y_continuous(labels=c("0", "10000", "20000", "30000", "40000"))+
  #  theme(axis.text.x = element_text(face = 'bold'))+
  theme_classic()+
  theme(axis.text.y =  element_text(face="bold", size = 8))+
  theme(axis.text.x = element_text(face="bold", size = 9))+
#  facet_wrap("Desert")+
#  facet_grid(~Desert)+
  # scale_y_continuous(labels=c("0", "10000", "20000", "30000", "40000"))+
  #  geom_col(just = 0.5)+
  #  theme() +
  xlab("Plant Families")+
  ylab("Number of occurence")



table(DesertBeeplant$correctPlantSpecName)
DesertPlantSpecies = table(DesertBeeplant$correctPlantSpecName,DesertBeeplant$FRegion,exclude = NA)
