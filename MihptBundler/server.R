
# Sys.setlocale('LC_ALL','C') 

library(plyr)

shinyServer(function(input, output) {
 
  output$contents <- renderTable({
    inFile <- input$files[[1, 'datapath']]

    if (is.null(input$files))
      return(NULL)
  
    sample_data <- read.table(inFile, header=input$header, sep=input$sep, skip=input$toplines, na.strings=c("NA",input$nas), quote=input$quote)
    sample_data
  })
  
  dat <- reactive({
    fileNames<-input$files[,'datapath']
    names(fileNames)<-input$files[,'name']
    full_data <- ldply(fileNames, read.table, header=input$header, sep=input$sep, skip=input$toplines,na.strings=c("NA",input$nas),quote=input$quote)
    full_data
  })
  
  maxes <- reactive({
    aggregate(.~.id, dat(),FUN=input$func)
    
  })
  output$transformedContents <- renderTable({
    maxes()
  })
 
  output$dlTransformedData <- downloadHandler(
    filename="MaxMiHPT.csv",
    content = function(file){
      write.csv(maxes(),file)
      
    }
    
  )  
  
})