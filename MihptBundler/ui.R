shinyUI(pageWithSidebar(
  
  # Application title
  headerPanel("Labrador - Bundle all your MiHPT logs"),
  
  sidebarPanel(
    fileInput('files', "Choose MiHPT data file (.mhp)", multiple=TRUE),
    tags$hr(),
    
    numericInput('toplines','Lines to skip at the top of the file',0,min=0),
    checkboxInput('header', 'Is there a Header row', TRUE),
    
    textInput('nas','How are null values coded?',"ND"),
    radioButtons('sep', 'Field Separator',
                 c(Comma=',',
                   Semicolon=';',
                   Tab='\t'),
                 'Comma'),
    radioButtons('quote', 'Text Quote',
                 c(None='',
                   'Double Quote'='"',
                   'Single Quote'="'"),
                 'Double Quote')
    
    
    
  ),
  
  mainPanel(
    h3(textOutput("Showing content of first designated file")),
    tabsetPanel(
      tabPanel("Original File", tableOutput('contents')),
      tabPanel("Surfer Format", 
               downloadButton('dlTransformedData', 'Download'),
               tableOutput('transformedContents'))
    )
  )
))

# runApp("/Users/jason/Documents/Azimuth1/Azimuth1/IR+D/labrador")